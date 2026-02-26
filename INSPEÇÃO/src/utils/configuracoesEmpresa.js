/**
 * Utilitário para gerenciar configurações da empresa
 * Busca dados do Supabase para usar em contratos, relatórios, etc.
 */

/**
 * Busca as configurações da empresa do Supabase
 * @param {Object} supabase - Cliente Supabase
 * @returns {Promise<Object>} Dados da empresa
 */
export async function buscarConfiguracoesEmpresa(supabase) {
    try {
        const {
            data,
            error
        } = await supabase
            .from('configuracoes_empresa')
            .select('*')
            .limit(1)
            .single();

        if (error) {
            console.error('Erro ao buscar configurações:', error);
            return getDadosEmpresaPadrao();
        }

        // Se não houver dados, retornar padrão
        if (!data) {
            return getDadosEmpresaPadrao();
        }

        // Mapear dados do banco para formato usado pelos PDFs
        return {
            razaoSocial: data.nome_empresa || 'ENTERFIX INDUSTRIA COMERCIO E SERVIÇOS LTDA',
            nomeFantasia: data.nome_fantasia || 'Enterfix Ind. Com. Serv. Ltda.',
            cnpj: data.cnpj || '13.250.539/0001-40',
            inscricaoEstadual: data.inscricao_estadual || '635.379.359.117',
            inscricaoMunicipal: data.inscricao_municipal || '',
            endereco: data.endereco_completo || 'Rua Waldemar Martins Ferreira, 287, Vila Alvinópolis',
            cep: data.cep || '09891-010',
            cidade: data.cidade || 'São Bernardo do Campo',
            estado: data.estado || 'SP',
            telefone: data.telefone || '(11) 4942-2222',
            celular: data.celular || '',
            email: data.email || 'service@enterfix.com.br',
            website: data.website || 'www.enterfix.com.br',
            acreditacaoInmetro: data.acreditacao_inmetro || 'RBC-XXXX',
            regimeTributario: data.regime_tributario || 'Lucro Presumido',
        };
    } catch (err) {
        console.error('Exceção ao buscar configurações:', err);
        return getDadosEmpresaPadrao();
    }
}

/**
 * Retorna dados padrão da empresa (fallback)
 * @returns {Object} Dados padrão
 */
export function getDadosEmpresaPadrao() {
    return {
        razaoSocial: 'ENTERFIX INDUSTRIA COMERCIO E SERVIÇOS LTDA',
        nomeFantasia: 'Enterfix Ind. Com. Serv. Ltda.',
        cnpj: '13.250.539/0001-40',
        inscricaoEstadual: '635.379.359.117',
        inscricaoMunicipal: '',
        endereco: 'Rua Waldemar Martins Ferreira, 287, Vila Alvinópolis',
        cep: '09891-010',
        cidade: 'São Bernardo do Campo',
        estado: 'SP',
        telefone: '(11) 4942-2222',
        celular: '',
        email: 'service@enterfix.com.br',
        website: 'www.enterfix.com.br',
        acreditacaoInmetro: 'RBC-XXXX',
        regimeTributario: 'Lucro Presumido',
    };
}

/**
 * Atualiza as configurações da empresa no Supabase
 * @param {Object} supabase - Cliente Supabase
 * @param {Object} dados - Dados a atualizar
 * @returns {Promise<Object>} Resultado da operação
 */
export async function atualizarConfiguracoesEmpresa(supabase, dados) {
    try {
        // Buscar o ID do único registro
        const {
            data: existing,
            error: fetchError
        } = await supabase
            .from('configuracoes_empresa')
            .select('id')
            .limit(1)
            .single();

        if (fetchError && fetchError.code !== 'PGRST116') {
            // PGRST116 = no rows returned
            throw fetchError;
        }

        // Mapear dados do frontend para o banco
        const dadosDB = {
            nome_empresa: dados.nomeEmpresa || dados.razaoSocial,
            nome_fantasia: dados.nomeFantasia,
            cnpj: dados.cnpj,
            inscricao_estadual: dados.inscricaoEstadual,
            inscricao_municipal: dados.inscricaoMunicipal,
            endereco_completo: dados.endereco || dados.enderecoCompleto,
            cep: dados.cep,
            cidade: dados.cidade,
            estado: dados.estado,
            telefone: dados.telefone,
            celular: dados.celular,
            email: dados.email,
            website: dados.website,
            acreditacao_inmetro: dados.acreditacaoInmetro,
            regime_tributario: dados.regimeTributario,
        };

        let result;
        if (existing && existing.id) {
            // Atualizar registro existente
            result = await supabase
                .from('configuracoes_empresa')
                .update(dadosDB)
                .eq('id', existing.id)
                .select()
                .single();
        } else {
            // Inserir novo registro
            result = await supabase
                .from('configuracoes_empresa')
                .insert([dadosDB])
                .select()
                .single();
        }

        if (result.error) {
            throw result.error;
        }

        return {
            success: true,
            data: result.data
        };
    } catch (err) {
        console.error('Erro ao atualizar configurações:', err);
        return {
            success: false,
            error: err.message
        };
    }
}

/**
 * Formata dados da empresa para exibição em contratos
 * @param {Object} dadosEmpresa - Dados da empresa
 * @returns {string} Texto formatado
 */
export function formatarDadosEmpresa(dadosEmpresa) {
    const partes = [
        dadosEmpresa.razaoSocial,
        `CNPJ: ${dadosEmpresa.cnpj}`,
    ];

    if (dadosEmpresa.inscricaoEstadual) {
        partes.push(`I.E.: ${dadosEmpresa.inscricaoEstadual}`);
    }

    partes.push(
        dadosEmpresa.endereco,
        `${dadosEmpresa.cidade}/${dadosEmpresa.estado} - CEP: ${dadosEmpresa.cep}`,
        `Tel: ${dadosEmpresa.telefone}`,
        `E-mail: ${dadosEmpresa.email}`,
    );

    if (dadosEmpresa.website) {
        partes.push(`Site: ${dadosEmpresa.website}`);
    }

    return partes.join(' | ');
}