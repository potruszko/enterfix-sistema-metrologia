/**
 * Bling API v3 - Utilitário Frontend
 *
 * Todas as chamadas passam pelo proxy Vercel (/api/bling/proxy)
 * para manter o client_secret seguro e evitar problemas de CORS.
 *
 * Variáveis de ambiente necessárias (arquivo .env):
 *   VITE_BLING_CLIENT_ID   - Client ID do seu app no portal Bling
 */
import {
    supabase
} from '../lib/supabase';

const BLING_CLIENT_ID =
    import.meta.env.VITE_BLING_CLIENT_ID;

// Scopes necessários — configurados no portal Bling ao criar o app.
// A URL de autorização passa apenas o identificador; o Bling usa os escopos
// cadastrados na aplicação automaticamente.
const BLING_SCOPES = [
    'contatos.read',
    'contatos.insert',
    'contatos.update',
    'produtos.read',
    'ordens-de-servico.read',
].join(' ');

// URL base correta para Bling API v3
const BLING_AUTH_URL = 'https://www.bling.com.br/Api/v3/oauth/authorize';

// ─────────────────────────────────────────
// Autenticação OAuth 2.0
// ─────────────────────────────────────────

/**
 * Gera a URL de autorização do Bling para iniciar o fluxo OAuth
 */
async function getAuthUrl() {
    const {
        data: {
            user
        }
    } = await supabase.auth.getUser();
    if (!user) throw new Error('Usuário não autenticado');

    const state = encodeURIComponent(btoa(user.id));
    const redirectUri = `${window.location.origin}/api/bling/callback`;

    const params = new URLSearchParams({
        response_type: 'code',
        client_id: BLING_CLIENT_ID,
        redirect_uri: redirectUri,
        state,
    });

    return `${BLING_AUTH_URL}?${params.toString()}`;
}

/**
 * Inicia o fluxo OAuth abrindo janela de autorização do Bling
 */
export async function conectarBling() {
    const url = await getAuthUrl();
    window.location.href = url;
}

/**
 * Verifica se o usuário atual tem conexão ativa com Bling
 */
export async function verificarConexao() {
    const {
        data: {
            user
        }
    } = await supabase.auth.getUser();
    if (!user) return false;

    const {
        data,
        error
    } = await supabase
        .from('bling_tokens')
        .select('expires_at')
        .eq('user_id', user.id)
        .single();

    return !error && !!data;
}

/**
 * Desconecta o Bling removendo os tokens do banco
 */
export async function desconectarBling() {
    const {
        data: {
            user
        }
    } = await supabase.auth.getUser();
    if (!user) return;
    await supabase.from('bling_tokens').delete().eq('user_id', user.id);
}

// ─────────────────────────────────────────
// Chamada base ao proxy
// ─────────────────────────────────────────

async function callProxy(endpoint, params = {}) {
    const {
        data: {
            session
        }
    } = await supabase.auth.getSession();
    if (!session) throw new Error('Sessão expirada. Faça login novamente.');

    const url = new URL('/api/bling/proxy', window.location.origin);
    url.searchParams.set('endpoint', endpoint);
    if (Object.keys(params).length > 0) {
        url.searchParams.set('params', JSON.stringify(params));
    }

    const response = await fetch(url.toString(), {
        headers: {
            'Authorization': `Bearer ${session.access_token}`
        },
    });

    if (response.status === 401) {
        throw new Error('BLING_NOT_CONNECTED');
    }

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.error || `Erro ${response.status} na API do Bling`);
    }

    return data;
}

// ─────────────────────────────────────────
// Busca paginada com coleta de todas as páginas
// ─────────────────────────────────────────

async function fetchAllPages(endpoint, extraParams = {}, onProgress) {
    const allItems = [];
    let pagina = 1;
    let hasMore = true;
    const LIMITE = 100;

    while (hasMore) {
        const data = await callProxy(endpoint, {
            pagina,
            limite: LIMITE,
            ...extraParams
        });
        const items = data ?.data ?? [];
        allItems.push(...items);

        if (onProgress) onProgress(allItems.length);

        // Bling v3 indica mais páginas pelo campo "data" ter exatamente "limite" itens
        hasMore = items.length === LIMITE;
        pagina++;

        // Proteção contra loop infinito
        if (pagina > 200) break;
    }

    return allItems;
}

// ─────────────────────────────────────────
// Endpoints específicos
// ─────────────────────────────────────────

/**
 * Busca todos os contatos/clientes do Bling
 */
export async function fetchContatosBling(onProgress) {
    return fetchAllPages('/contatos', {}, onProgress);
}

/**
 * Busca todos os produtos do Bling
 */
export async function fetchProdutosBling(onProgress) {
    return fetchAllPages('/produtos', {}, onProgress);
}

/**
 * Busca todas as OS do Bling
 */
export async function fetchOrdensServicoBling(onProgress) {
    return fetchAllPages('/ordens-de-servico', {}, onProgress);
}

// ─────────────────────────────────────────
// Mapeamento: Bling → Supabase
// ─────────────────────────────────────────

/**
 * Mapeia um contato do Bling para o formato da tabela `clientes`
 */
export function mapearContatoParaCliente(contato) {
    const tipoPessoa = contato.tipo === 'F' ? 'fisica' : 'juridica';
    const doc = contato.numeroDocumento ?.replace(/\D/g, '') || '';

    return {
        bling_id: String(contato.id),
        codigo: contato.codigo || null,
        tipo_pessoa: tipoPessoa,
        razao_social: contato.nome || '',
        nome_fantasia: contato.fantasia || contato.nome || '',
        cnpj: tipoPessoa === 'juridica' ? doc : null,
        cpf: tipoPessoa === 'fisica' ? doc : null,
        inscricao_estadual: contato.ie || null,
        email: contato.email || null,
        telefone: contato.telefone || null,
        celular: contato.celular || null,
        // Endereço
        cep: contato.endereco ?.cep ?.replace(/\D/g, '') || null,
        logradouro: contato.endereco ?.endereco || null,
        numero: contato.endereco ?.numero || null,
        complemento: contato.endereco ?.complemento || null,
        bairro: contato.endereco ?.bairro || null,
        cidade: contato.endereco ?.municipio || null,
        estado: contato.endereco ?.uf || null,
        situacao: contato.situacao === 'A' ? 'ativo' : 'inativo',
        ativo: contato.situacao === 'A',
        ultima_sincronizacao_bling: new Date().toISOString(),
    };
}

/**
 * Mapeia um produto do Bling para o formato da tabela `produtos`
 */
export function mapearProdutoBling(produto) {
    return {
        bling_id: produto.id,
        codigo: produto.codigo || null,
        nome: produto.nome || '',
        unidade: produto.unidade || 'UN',
        preco: produto.preco ?? null,
        preco_custo: produto.precoCusto ?? null,
        descricao: produto.descricaoCurta || produto.descricao || null,
        categoria: produto.categoria ?.nome || null,
        estoque_atual: produto.estoque ?.saldoVirtualTotal ?? 0,
        situacao: produto.situacao === 'A' ? 'ativo' : 'inativo',
        ultima_sinc_bling: new Date().toISOString(),
    };
}

/**
 * Mapeia uma OS do Bling para o formato da tabela `ordens_servico_bling`
 */
export function mapearOSBling(os) {
    const situacaoMap = {
        0: 'Em Aberto',
        3: 'Em Andamento',
        6: 'Concluída',
        9: 'Cancelada',
    };
    return {
        bling_id: os.id,
        numero: String(os.numero),
        situacao: situacaoMap[os.situacao] ?? String(os.situacao),
        data_abertura: os.data || null,
        data_prev_termino: os.dataPrevistaTermino || null,
        data_encerramento: os.dataEncerramento || null,
        cliente_bling_id: os.cliente ?.id ?? null,
        cliente_nome: os.cliente ?.nome || os.contato ?.nome || null,
        contato_nome: os.contato ?.nome || null,
        observacoes: os.observacoes || null,
        total: os.total ?? null,
        ultima_sinc_bling: new Date().toISOString(),
    };
}

// ─────────────────────────────────────────
// Importação para o Supabase
// ─────────────────────────────────────────

/**
 * Importa contatos do Bling para a tabela clientes
 * Retorna { importados, atualizados, erros }
 */
export async function importarClientes(contatos) {
    let importados = 0,
        atualizados = 0,
        erros = 0;

    for (const contato of contatos) {
        try {
            const clienteData = mapearContatoParaCliente(contato);

            // Upsert por bling_id
            const {
                error
            } = await supabase
                .from('clientes')
                .upsert(clienteData, {
                    onConflict: 'bling_id',
                    ignoreDuplicates: false
                });

            if (error) throw error;

            // Determinar se foi insert ou update
            const {
                data: existing
            } = await supabase
                .from('clientes')
                .select('id, created_at, updated_at')
                .eq('bling_id', clienteData.bling_id)
                .single();

            if (existing ?.created_at === existing ?.updated_at) importados++;
            else atualizados++;
        } catch {
            erros++;
        }
    }

    return {
        importados,
        atualizados,
        erros
    };
}

/**
 * Importa produtos do Bling para a tabela produtos
 */
export async function importarProdutos(produtos) {
    let importados = 0,
        atualizados = 0,
        erros = 0;

    for (const produto of produtos) {
        try {
            const produtoData = mapearProdutoBling(produto);

            const {
                error
            } = await supabase
                .from('produtos')
                .upsert(produtoData, {
                    onConflict: 'bling_id',
                    ignoreDuplicates: false
                });

            if (error) throw error;
            importados++;
        } catch {
            erros++;
        }
    }

    return {
        importados,
        atualizados,
        erros
    };
}

/**
 * Importa OS do Bling para a tabela ordens_servico_bling
 * Tenta vincular automaticamente a clientes existentes pelo bling_id
 */
export async function importarOS(ordens) {
    let importados = 0,
        atualizados = 0,
        erros = 0;

    for (const os of ordens) {
        try {
            const osData = mapearOSBling(os);

            // Tentar vincular ao cliente interno pelo bling_id
            if (osData.cliente_bling_id) {
                const {
                    data: clienteInterno
                } = await supabase
                    .from('clientes')
                    .select('id')
                    .eq('bling_id', String(osData.cliente_bling_id))
                    .single();

                if (clienteInterno) osData.cliente_id = clienteInterno.id;
            }

            const {
                error
            } = await supabase
                .from('ordens_servico_bling')
                .upsert(osData, {
                    onConflict: 'bling_id',
                    ignoreDuplicates: false
                });

            if (error) throw error;
            importados++;
        } catch {
            erros++;
        }
    }

    return {
        importados,
        atualizados,
        erros
    };
}

/**
 * Salva log de sincronização no Supabase
 */
export async function salvarLogSinc(tipo, resultado) {
    const {
        data: {
            user
        }
    } = await supabase.auth.getUser();
    if (!user) return;

    await supabase.from('bling_sync_logs').insert({
        user_id: user.id,
        tipo,
        status: resultado.erros === 0 ? 'sucesso' : resultado.importados > 0 ? 'parcial' : 'erro',
        total_bling: resultado.totalBling ?? 0,
        importados: resultado.importados ?? 0,
        atualizados: resultado.atualizados ?? 0,
        erros: resultado.erros ?? 0,
        detalhes: resultado.detalhes ?? null,
    });
}