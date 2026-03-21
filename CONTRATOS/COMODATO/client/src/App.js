import React, {
    useState
} from 'react';
import './App.css';
import Header from './components/Header';
import ContratoForm from './components/ContratoForm';
import ListaContratos from './components/ListaContratos';

function App() {
    const [abaAtiva, setAbaAtiva] = useState('gerar');
    const [contratos, setContratos] = useState([]);
    const [contratoEditando, setContratoEditando] = useState(null);

    const adicionarContrato = (novoContrato) => {
        setContratos([novoContrato, ...contratos]);
    };

    const editarContrato = (contrato) => {
        setContratoEditando(contrato);
        setAbaAtiva('gerar');
    };

    const limparEdicao = () => {
        setContratoEditando(null);
    };

    return ( <
        div className = "App" >
        <
        Header / >

        <
        div className = "tabs" >
        <
        button className = {
            abaAtiva === 'gerar' ? 'tab-button active' : 'tab-button'
        }
        onClick = {
            () => setAbaAtiva('gerar')
        } >
        Gerar Contrato <
        /button> <
        button className = {
            abaAtiva === 'historico' ? 'tab-button active' : 'tab-button'
        }
        onClick = {
            () => setAbaAtiva('historico')
        } >
        Histórico <
        /button> <
        /div>

        <
        div className = "tab-content" > {
            abaAtiva === 'gerar' ? ( <
                ContratoForm onContratoGerado = {
                    adicionarContrato
                }
                contratoEditando = {
                    contratoEditando
                }
                onLimparEdicao = {
                    limparEdicao
                }
                />
            ) : ( <
                ListaContratos contratos = {
                    contratos
                }
                onEditarContrato = {
                    editarContrato
                }
                />
            )
        } <
        /div> <
        /div>
    );
}

export default App;