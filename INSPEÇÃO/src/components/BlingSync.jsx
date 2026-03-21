import React, { useState, useEffect, useCallback } from 'react';
import {
  RefreshCw, Link2, Link2Off, CheckCircle, XCircle, AlertTriangle,
  Users, Package, ClipboardList, ChevronRight, Download, Info,
  ArrowRight, Loader2, Wifi, WifiOff, ExternalLink
} from 'lucide-react';
import {
  conectarBling,
  desconectarBling,
  verificarConexao,
  fetchContatosBling,
  fetchProdutosBling,
  fetchOrdensServicoBling,
  importarClientes,
  importarProdutos,
  importarOS,
  salvarLogSinc,
} from '../utils/blingApi';
import { useAlert } from './AlertSystem';

// ─────────────────────────────────────────
// Sub-componentes
// ─────────────────────────────────────────

const StatusBadge = ({ situacao }) => {
  const map = {
    'ativo': 'bg-green-100 text-green-700',
    'A': 'bg-green-100 text-green-700',
    'inativo': 'bg-gray-100 text-gray-600',
    'I': 'bg-gray-100 text-gray-600',
    'Em Aberto': 'bg-blue-100 text-blue-700',
    'Em Andamento': 'bg-yellow-100 text-yellow-700',
    'Concluída': 'bg-green-100 text-green-700',
    'Cancelada': 'bg-red-100 text-red-600',
  };
  const label = situacao === 'A' ? 'Ativo' : situacao === 'I' ? 'Inativo' : situacao;
  return (
    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${map[situacao] || 'bg-gray-100 text-gray-600'}`}>
      {label}
    </span>
  );
};

const ResultadoCard = ({ resultado }) => {
  if (!resultado) return null;
  return (
    <div className={`mt-4 p-4 rounded-lg border ${resultado.erros === 0
      ? 'bg-green-50 border-green-200'
      : resultado.importados > 0
        ? 'bg-yellow-50 border-yellow-200'
        : 'bg-red-50 border-red-200'
      }`}>
      <div className="flex items-center gap-2 mb-2">
        {resultado.erros === 0
          ? <CheckCircle size={16} className="text-green-600" />
          : <AlertTriangle size={16} className="text-yellow-600" />
        }
        <span className="font-medium text-sm">
          {resultado.erros === 0 ? 'Importação concluída!' : 'Importação com avisos'}
        </span>
      </div>
      <div className="grid grid-cols-3 gap-2 text-sm">
        <div className="text-center">
          <div className="text-green-600 font-bold text-lg">{resultado.importados}</div>
          <div className="text-gray-500 text-xs">Novos</div>
        </div>
        <div className="text-center">
          <div className="text-blue-600 font-bold text-lg">{resultado.atualizados}</div>
          <div className="text-gray-500 text-xs">Atualizados</div>
        </div>
        <div className="text-center">
          <div className="text-red-600 font-bold text-lg">{resultado.erros}</div>
          <div className="text-gray-500 text-xs">Erros</div>
        </div>
      </div>
    </div>
  );
};

// ─────────────────────────────────────────
// Aba: Clientes
// ─────────────────────────────────────────

const AbaClientes = () => {
  const alert = useAlert();
  const [contatos, setContatos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [importando, setImportando] = useState(false);
  const [progresso, setProgresso] = useState(0);
  const [resultado, setResultado] = useState(null);
  const [busca, setBusca] = useState('');

  const carregarContatos = async () => {
    setLoading(true);
    setResultado(null);
    try {
      const dados = await fetchContatosBling((n) => setProgresso(n));
      setContatos(dados);
    } catch (err) {
      if (err.message === 'BLING_NOT_CONNECTED') {
        alert.error('Bling não conectado. Conecte na aba de configuração.');
      } else {
        alert.error(`Erro ao buscar contatos: ${err.message}`);
      }
    } finally {
      setLoading(false);
      setProgresso(0);
    }
  };

  const handleImportar = async () => {
    if (!contatos.length) return;
    setImportando(true);
    setResultado(null);
    try {
      const res = await importarClientes(contatos);
      setResultado({ ...res, totalBling: contatos.length });
      await salvarLogSinc('clientes', { ...res, totalBling: contatos.length });
      alert.success(`${res.importados} clientes importados, ${res.atualizados} atualizados.`);
    } catch (err) {
      alert.error(`Erro na importação: ${err.message}`);
    } finally {
      setImportando(false);
    }
  };

  const contatosFiltrados = contatos.filter(c =>
    !busca || c.nome?.toLowerCase().includes(busca.toLowerCase()) ||
    c.numeroDocumento?.includes(busca) || c.email?.toLowerCase().includes(busca.toLowerCase())
  );

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
        <div>
          <h3 className="font-semibold text-gray-800">Clientes / Contatos</h3>
          <p className="text-sm text-gray-500">
            Importe seus clientes do Bling para o sistema.
            {contatos.length > 0 && ` (${contatos.length} encontrados)`}
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={carregarContatos}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors text-sm"
          >
            {loading
              ? <Loader2 size={15} className="animate-spin" />
              : <RefreshCw size={15} />
            }
            {loading ? `Buscando... (${progresso})` : 'Buscar do Bling'}
          </button>
          {contatos.length > 0 && (
            <button
              onClick={handleImportar}
              disabled={importando}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 transition-colors text-sm"
            >
              {importando ? <Loader2 size={15} className="animate-spin" /> : <Download size={15} />}
              {importando ? 'Importando...' : `Importar ${contatos.length}`}
            </button>
          )}
        </div>
      </div>

      <ResultadoCard resultado={resultado} />

      {contatos.length > 0 && (
        <>
          <input
            type="text"
            placeholder="Filtrar por nome, CNPJ/CPF ou e-mail..."
            value={busca}
            onChange={e => setBusca(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <div className="border border-gray-200 rounded-lg overflow-hidden">
            <div className="overflow-x-auto max-h-96">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 text-gray-600 text-xs uppercase">
                  <tr>
                    <th className="px-4 py-3 text-left">Nome</th>
                    <th className="px-4 py-3 text-left">CNPJ / CPF</th>
                    <th className="px-4 py-3 text-left">E-mail</th>
                    <th className="px-4 py-3 text-left">Cidade/UF</th>
                    <th className="px-4 py-3 text-left">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {contatosFiltrados.slice(0, 200).map(c => (
                    <tr key={c.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3">
                        <div className="font-medium text-gray-800">{c.nome}</div>
                        {c.fantasia && c.fantasia !== c.nome && (
                          <div className="text-gray-400 text-xs">{c.fantasia}</div>
                        )}
                      </td>
                      <td className="px-4 py-3 text-gray-600 font-mono text-xs">
                        {c.numeroDocumento || '—'}
                      </td>
                      <td className="px-4 py-3 text-gray-600">{c.email || '—'}</td>
                      <td className="px-4 py-3 text-gray-600">
                        {c.endereco?.municipio
                          ? `${c.endereco.municipio}/${c.endereco.uf}`
                          : '—'}
                      </td>
                      <td className="px-4 py-3">
                        <StatusBadge situacao={c.situacao} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {contatosFiltrados.length > 200 && (
              <div className="px-4 py-2 bg-gray-50 text-xs text-gray-500 text-center">
                Exibindo 200 de {contatosFiltrados.length}. Use o filtro para refinar.
              </div>
            )}
          </div>
        </>
      )}

      {!loading && contatos.length === 0 && (
        <div className="text-center py-10 text-gray-400">
          <Users size={40} className="mx-auto mb-2 opacity-30" />
          <p>Clique em "Buscar do Bling" para carregar os contatos</p>
        </div>
      )}
    </div>
  );
};

// ─────────────────────────────────────────
// Aba: Produtos
// ─────────────────────────────────────────

const AbaProdutos = () => {
  const alert = useAlert();
  const [produtos, setProdutos] = useState([]);
  const [loading, setLoading] = useState(false);
  const [importando, setImportando] = useState(false);
  const [progresso, setProgresso] = useState(0);
  const [resultado, setResultado] = useState(null);
  const [busca, setBusca] = useState('');

  const carregarProdutos = async () => {
    setLoading(true);
    setResultado(null);
    try {
      const dados = await fetchProdutosBling((n) => setProgresso(n));
      setProdutos(dados);
    } catch (err) {
      if (err.message === 'BLING_NOT_CONNECTED') {
        alert.error('Bling não conectado.');
      } else {
        alert.error(`Erro ao buscar produtos: ${err.message}`);
      }
    } finally {
      setLoading(false);
      setProgresso(0);
    }
  };

  const handleImportar = async () => {
    if (!produtos.length) return;
    setImportando(true);
    setResultado(null);
    try {
      const res = await importarProdutos(produtos);
      setResultado({ ...res, totalBling: produtos.length });
      await salvarLogSinc('produtos', { ...res, totalBling: produtos.length });
      alert.success(`${res.importados} produtos importados.`);
    } catch (err) {
      alert.error(`Erro na importação: ${err.message}`);
    } finally {
      setImportando(false);
    }
  };

  const produtosFiltrados = produtos.filter(p =>
    !busca || p.nome?.toLowerCase().includes(busca.toLowerCase()) ||
    p.codigo?.toLowerCase().includes(busca.toLowerCase())
  );

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
        <div>
          <h3 className="font-semibold text-gray-800">Produtos</h3>
          <p className="text-sm text-gray-500">
            Importe seu catálogo de produtos do Bling.
            {produtos.length > 0 && ` (${produtos.length} encontrados)`}
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={carregarProdutos}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors text-sm"
          >
            {loading ? <Loader2 size={15} className="animate-spin" /> : <RefreshCw size={15} />}
            {loading ? `Buscando... (${progresso})` : 'Buscar do Bling'}
          </button>
          {produtos.length > 0 && (
            <button
              onClick={handleImportar}
              disabled={importando}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 transition-colors text-sm"
            >
              {importando ? <Loader2 size={15} className="animate-spin" /> : <Download size={15} />}
              {importando ? 'Importando...' : `Importar ${produtos.length}`}
            </button>
          )}
        </div>
      </div>

      <ResultadoCard resultado={resultado} />

      {produtos.length > 0 && (
        <>
          <input
            type="text"
            placeholder="Filtrar por nome ou código..."
            value={busca}
            onChange={e => setBusca(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <div className="border border-gray-200 rounded-lg overflow-hidden">
            <div className="overflow-x-auto max-h-96">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 text-gray-600 text-xs uppercase">
                  <tr>
                    <th className="px-4 py-3 text-left">Código</th>
                    <th className="px-4 py-3 text-left">Nome</th>
                    <th className="px-4 py-3 text-left">Unidade</th>
                    <th className="px-4 py-3 text-right">Preço</th>
                    <th className="px-4 py-3 text-right">Estoque</th>
                    <th className="px-4 py-3 text-left">Status</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {produtosFiltrados.slice(0, 200).map(p => (
                    <tr key={p.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 font-mono text-xs text-gray-500">{p.codigo || '—'}</td>
                      <td className="px-4 py-3 font-medium text-gray-800">{p.nome}</td>
                      <td className="px-4 py-3 text-gray-600">{p.unidade || 'UN'}</td>
                      <td className="px-4 py-3 text-right text-gray-700">
                        {p.preco != null
                          ? new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(p.preco)
                          : '—'}
                      </td>
                      <td className="px-4 py-3 text-right text-gray-700">
                        {p.estoque?.saldoVirtualTotal ?? 0}
                      </td>
                      <td className="px-4 py-3">
                        <StatusBadge situacao={p.situacao} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {!loading && produtos.length === 0 && (
        <div className="text-center py-10 text-gray-400">
          <Package size={40} className="mx-auto mb-2 opacity-30" />
          <p>Clique em "Buscar do Bling" para carregar os produtos</p>
        </div>
      )}
    </div>
  );
};

// ─────────────────────────────────────────
// Aba: Ordens de Serviço
// ─────────────────────────────────────────

const AbaOS = () => {
  const alert = useAlert();
  const [ordens, setOrdens] = useState([]);
  const [loading, setLoading] = useState(false);
  const [importando, setImportando] = useState(false);
  const [progresso, setProgresso] = useState(0);
  const [resultado, setResultado] = useState(null);
  const [busca, setBusca] = useState('');

  const carregarOS = async () => {
    setLoading(true);
    setResultado(null);
    try {
      const dados = await fetchOrdensServicoBling((n) => setProgresso(n));
      setOrdens(dados);
    } catch (err) {
      if (err.message === 'BLING_NOT_CONNECTED') {
        alert.error('Bling não conectado.');
      } else {
        alert.error(`Erro ao buscar OS: ${err.message}`);
      }
    } finally {
      setLoading(false);
      setProgresso(0);
    }
  };

  const handleImportar = async () => {
    if (!ordens.length) return;
    setImportando(true);
    setResultado(null);
    try {
      const res = await importarOS(ordens);
      setResultado({ ...res, totalBling: ordens.length });
      await salvarLogSinc('ordens_servico', { ...res, totalBling: ordens.length });
      alert.success(`${res.importados} OS importadas.`);
    } catch (err) {
      alert.error(`Erro na importação: ${err.message}`);
    } finally {
      setImportando(false);
    }
  };

  const situacaoLabel = (s) => {
    const map = { 0: 'Em Aberto', 3: 'Em Andamento', 6: 'Concluída', 9: 'Cancelada' };
    return map[s] ?? String(s);
  };

  const ordensFiltradas = ordens.filter(o =>
    !busca ||
    String(o.numero)?.includes(busca) ||
    o.cliente?.nome?.toLowerCase().includes(busca.toLowerCase()) ||
    o.contato?.nome?.toLowerCase().includes(busca.toLowerCase())
  );

  return (
    <div className="space-y-4">
      <div className="flex flex-col sm:flex-row gap-3 items-start sm:items-center justify-between">
        <div>
          <h3 className="font-semibold text-gray-800">Ordens de Serviço</h3>
          <p className="text-sm text-gray-500">
            Importe as OS do Bling. Clientes já importados serão vinculados automaticamente.
            {ordens.length > 0 && ` (${ordens.length} encontradas)`}
          </p>
        </div>
        <div className="flex gap-2">
          <button
            onClick={carregarOS}
            disabled={loading}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 transition-colors text-sm"
          >
            {loading ? <Loader2 size={15} className="animate-spin" /> : <RefreshCw size={15} />}
            {loading ? `Buscando... (${progresso})` : 'Buscar do Bling'}
          </button>
          {ordens.length > 0 && (
            <button
              onClick={handleImportar}
              disabled={importando}
              className="flex items-center gap-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50 transition-colors text-sm"
            >
              {importando ? <Loader2 size={15} className="animate-spin" /> : <Download size={15} />}
              {importando ? 'Importando...' : `Importar ${ordens.length}`}
            </button>
          )}
        </div>
      </div>

      <ResultadoCard resultado={resultado} />

      {ordens.length > 0 && (
        <>
          <input
            type="text"
            placeholder="Filtrar por número ou cliente..."
            value={busca}
            onChange={e => setBusca(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          />
          <div className="border border-gray-200 rounded-lg overflow-hidden">
            <div className="overflow-x-auto max-h-96">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 text-gray-600 text-xs uppercase">
                  <tr>
                    <th className="px-4 py-3 text-left">Nº OS</th>
                    <th className="px-4 py-3 text-left">Cliente</th>
                    <th className="px-4 py-3 text-left">Data</th>
                    <th className="px-4 py-3 text-left">Prev. Término</th>
                    <th className="px-4 py-3 text-right">Total</th>
                    <th className="px-4 py-3 text-left">Situação</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {ordensFiltradas.slice(0, 200).map(o => (
                    <tr key={o.id} className="hover:bg-gray-50">
                      <td className="px-4 py-3 font-mono text-gray-700 font-medium">
                        #{o.numero}
                      </td>
                      <td className="px-4 py-3 text-gray-800">
                        {o.cliente?.nome || o.contato?.nome || '—'}
                      </td>
                      <td className="px-4 py-3 text-gray-600">
                        {o.data
                          ? new Date(o.data).toLocaleDateString('pt-BR')
                          : '—'}
                      </td>
                      <td className="px-4 py-3 text-gray-600">
                        {o.dataPrevistaTermino
                          ? new Date(o.dataPrevistaTermino).toLocaleDateString('pt-BR')
                          : '—'}
                      </td>
                      <td className="px-4 py-3 text-right text-gray-700">
                        {o.total != null
                          ? new Intl.NumberFormat('pt-BR', { style: 'currency', currency: 'BRL' }).format(o.total)
                          : '—'}
                      </td>
                      <td className="px-4 py-3">
                        <StatusBadge situacao={situacaoLabel(o.situacao)} />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </>
      )}

      {!loading && ordens.length === 0 && (
        <div className="text-center py-10 text-gray-400">
          <ClipboardList size={40} className="mx-auto mb-2 opacity-30" />
          <p>Clique em "Buscar do Bling" para carregar as OS</p>
        </div>
      )}
    </div>
  );
};

// ─────────────────────────────────────────
// Componente Principal
// ─────────────────────────────────────────

const TABS = [
  { id: 'clientes', label: 'Clientes', icon: Users },
  { id: 'produtos', label: 'Produtos', icon: Package },
  { id: 'os', label: 'Ordens de Serviço', icon: ClipboardList },
];

const BlingSync = () => {
  const alert = useAlert();
  const [conectado, setConectado] = useState(null); // null = carregando
  const [abaAtiva, setAbaAtiva] = useState('clientes');
  const [desconectando, setDesconectando] = useState(false);

  // Verificar status da conexão ao montar
  useEffect(() => {
    verificarStatusConexao();
  }, []);

  // Processar retorno do OAuth (query params na URL)
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);

    if (params.get('bling_connected') === 'true') {
      setConectado(true);
      alert.success('Bling conectado com sucesso!');
      // Limpar query string sem recarregar a página
      window.history.replaceState({}, '', window.location.pathname);
    }

    if (params.get('bling_error')) {
      const msg = decodeURIComponent(params.get('bling_error'));
      alert.error(`Erro ao conectar Bling: ${msg}`);
      window.history.replaceState({}, '', window.location.pathname);
    }
  }, []);

  const verificarStatusConexao = useCallback(async () => {
    const status = await verificarConexao();
    setConectado(status);
  }, []);

  const handleConectar = async () => {
    try {
      await conectarBling();
    } catch (err) {
      alert.error(err.message);
    }
  };

  const handleDesconectar = async () => {
    if (!window.confirm('Deseja desconectar o Bling? Os dados já importados serão mantidos.')) return;
    setDesconectando(true);
    try {
      await desconectarBling();
      setConectado(false);
      alert.success('Bling desconectado.');
    } catch (err) {
      alert.error(err.message);
    } finally {
      setDesconectando(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            {/* Logo Bling – ícone simples com texto */}
            <div className="w-12 h-12 bg-orange-500 rounded-xl flex items-center justify-center text-white font-bold text-lg shadow-sm">
              B
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-800">Integração Bling ERP</h1>
              <p className="text-sm text-gray-500">Sincronize clientes, produtos e OS do Bling</p>
            </div>
          </div>

          {/* Status & botão de conexão */}
          <div className="flex items-center gap-3">
            {conectado === null ? (
              <div className="flex items-center gap-2 text-gray-400 text-sm">
                <Loader2 size={16} className="animate-spin" />
                Verificando...
              </div>
            ) : conectado ? (
              <>
                <div className="flex items-center gap-2 text-green-600 text-sm font-medium">
                  <Wifi size={16} />
                  Conectado
                </div>
                <button
                  onClick={handleDesconectar}
                  disabled={desconectando}
                  className="flex items-center gap-2 px-4 py-2 border border-red-300 text-red-600 rounded-lg hover:bg-red-50 transition-colors text-sm"
                >
                  {desconectando ? <Loader2 size={14} className="animate-spin" /> : <Link2Off size={14} />}
                  Desconectar
                </button>
              </>
            ) : (
              <>
                <div className="flex items-center gap-2 text-gray-400 text-sm">
                  <WifiOff size={16} />
                  Não conectado
                </div>
                <button
                  onClick={handleConectar}
                  className="flex items-center gap-2 px-4 py-2 bg-orange-500 text-white rounded-lg hover:bg-orange-600 transition-colors text-sm font-medium shadow-sm"
                >
                  <Link2 size={14} />
                  Conectar Bling
                </button>
              </>
            )}
          </div>
        </div>

        {/* Banner informativo quando não conectado */}
        {conectado === false && (
          <div className="mt-4 space-y-3">
            {/* URI de callback — caixa de destaque */}
            <div className="p-4 bg-red-50 border border-red-300 rounded-lg">
              <p className="text-sm font-bold text-red-800 mb-2">
                ⚠️ Configure esta URI exata no portal Bling (sem barra no final):
              </p>
              <div className="flex items-center gap-2">
                <code className="flex-1 bg-white border border-red-200 px-3 py-2 rounded text-sm font-mono text-red-700 break-all select-all">
                  {window.location.origin}/api/bling/callback
                </code>
                <button
                  onClick={() => {
                    navigator.clipboard.writeText(`${window.location.origin}/api/bling/callback`);
                  }}
                  className="px-3 py-2 bg-red-600 text-white rounded text-xs font-medium hover:bg-red-700 whitespace-nowrap"
                >
                  Copiar
                </button>
              </div>
              <p className="text-xs text-red-600 mt-2">
                Bling → Configurações → API &amp; Integrações → seu app → campo "URL de Retorno / Callback URL"
              </p>
            </div>

            {/* Passos gerais */}
            <div className="p-4 bg-amber-50 border border-amber-200 rounded-lg">
              <div className="flex items-start gap-3">
                <Info size={18} className="text-amber-600 mt-0.5 flex-shrink-0" />
                <div className="text-sm">
                  <p className="font-medium text-amber-800 mb-1">Variáveis de ambiente no Vercel:</p>
                  <div className="space-y-1 font-mono text-xs text-amber-800 bg-amber-100 p-2 rounded">
                    <div>BLING_CLIENT_ID = <span className="text-amber-600">(seu client id)</span></div>
                    <div>BLING_CLIENT_SECRET = <span className="text-amber-600">(seu client secret)</span></div>
                    <div>BLING_REDIRECT_URI = <span className="text-amber-900 font-bold">{window.location.origin}/api/bling/callback</span></div>
                    <div>SUPABASE_SERVICE_ROLE_KEY = <span className="text-amber-600">(service role key)</span></div>
                    <div>VITE_APP_URL = <span className="text-amber-900 font-bold">{window.location.origin}</span></div>
                    <div>VITE_BLING_CLIENT_ID = <span className="text-amber-600">(seu client id)</span></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Conteúdo de sincronização - só exibir se conectado */}
      {conectado && (
        <div className="bg-white rounded-xl shadow-sm border border-gray-200">
          {/* Tabs */}
          <div className="flex border-b border-gray-200 overflow-x-auto">
            {TABS.map(tab => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setAbaAtiva(tab.id)}
                  className={`flex items-center gap-2 px-5 py-4 text-sm font-medium transition-colors whitespace-nowrap border-b-2 -mb-px ${
                    abaAtiva === tab.id
                      ? 'border-blue-600 text-blue-600'
                      : 'border-transparent text-gray-500 hover:text-gray-700'
                  }`}
                >
                  <Icon size={16} />
                  {tab.label}
                </button>
              );
            })}
          </div>

          {/* Conteúdo da aba ativa */}
          <div className="p-6">
            {abaAtiva === 'clientes' && <AbaClientes />}
            {abaAtiva === 'produtos' && <AbaProdutos />}
            {abaAtiva === 'os' && <AbaOS />}
          </div>
        </div>
      )}

      {/* Dica de ordem de importação */}
      {conectado && (
        <div className="bg-blue-50 border border-blue-200 rounded-xl p-4">
          <div className="flex items-center gap-2 text-blue-700 font-medium text-sm mb-2">
            <Info size={16} />
            Ordem recomendada de importação
          </div>
          <div className="flex items-center gap-2 text-sm text-blue-600 flex-wrap">
            <span className="bg-white border border-blue-200 px-3 py-1 rounded-full flex items-center gap-1">
              <Users size={13} /> 1. Clientes
            </span>
            <ArrowRight size={14} className="text-blue-400" />
            <span className="bg-white border border-blue-200 px-3 py-1 rounded-full flex items-center gap-1">
              <Package size={13} /> 2. Produtos
            </span>
            <ArrowRight size={14} className="text-blue-400" />
            <span className="bg-white border border-blue-200 px-3 py-1 rounded-full flex items-center gap-1">
              <ClipboardList size={13} /> 3. OS
            </span>
          </div>
          <p className="text-xs text-blue-500 mt-2">
            Importar clientes primeiro permite que as OS sejam vinculadas automaticamente.
          </p>
        </div>
      )}
    </div>
  );
};

export default BlingSync;
