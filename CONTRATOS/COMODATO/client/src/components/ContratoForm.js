import React, {
    useState,
    useEffect
} from 'react';
import axios from 'axios';
import './ContratoForm.css';

function ContratoForm({
    contratoEditando,
    onContratoGerado
}) {
    const [formData, setFormData] = useState({
        nome: '',
        fantasia: '',
        cnpj: '',
        ie: '',
        cep: '',
        uf: '',
        cidade: '',
        bairro: '',
        endereco: '',
        numero: '',
        complemento: '',
        representante: '',
        cargo: '',
        telefone: '',
        celular: '',
        email: '',
        equipamento: '',
        numeroSerie: '',
        modelo: '',
        descricaoTecnica: '',
        estadoConservacao: 'Bom estado de funcionamento',
        acessorios: '',
        valorReferencia: '',
        finalidade: 'Teste, avaliação técnica e demonstração',
        dataInicio: '',
        prazoMeses: '12',
        nomeAssinante: '',
        cargoAssinante: ''
    });

    useEffect(() => {
        if (contratoEditando) {
            setFormData(contratoEditando);
        }
    }, [contratoEditando]);

    const handleChange = (e) => {
        const {
            name,
            value
        } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const buscarCEP = async (cep) => {
        const cepLimpo = cep.replace(/\D/g, '');
        if (cepLimpo.length === 8) {
            try {
                const response = await axios.get(`https://viacep.com.br/ws/${cepLimpo}/json/`);
                if (!response.data.erro) {
                    setFormData(prev => ({
                        ...prev,
                        endereco: response.data.logradouro,
                        bairro: response.data.bairro,
                        cidade: response.data.localidade,
                        uf: response.data.uf
                    }));
                }
            } catch (error) {
                console.error('Erro ao buscar CEP:', error);
            }
        }
    };

    const handleCEPChange = (e) => {
        const {
            value
        } = e.target;
        setFormData(prev => ({
            ...prev,
            cep: value
        }));
        buscarCEP(value);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('/api/contrato/gerar', formData, {
                responseType: 'blob'
            });

            const contentDisposition = response.headers['content-disposition'];
            let filename = 'contrato.docx';
            if (contentDisposition) {
                const filenameMatch = contentDisposition.match(/filename="(.+)"/);
                if (filenameMatch) {
                    filename = filenameMatch[1];
                }
            }

            const blob = new Blob([response.data], {
                type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
            });
            const url = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = url;
            link.setAttribute('download', filename);
            document.body.appendChild(link);
            link.click();
            link.remove();
            window.URL.revokeObjectURL(url);

            const contratoParaHistorico = {
                ...formData,
                data: new Date().toLocaleDateString('pt-BR'),
                numeroContrato: filename.replace('Contrato_', '').replace('.docx', '')
            };
            onContratoGerado(contratoParaHistorico);

            setFormData({
                nome: '',
                fantasia: '',
                cnpj: '',
                ie: '',
                cep: '',
                uf: '',
                cidade: '',
                bairro: '',
                endereco: '',
                numero: '',
                complemento: '',
                representante: '',
                cargo: '',
                telefone: '',
                celular: '',
                email: '',
                equipamento: '',
                numeroSerie: '',
                modelo: '',
                descricaoTecnica: '',
                estadoConservacao: 'Bom estado de funcionamento',
                acessorios: '',
                valorReferencia: '',
                finalidade: 'Teste, avaliação técnica e demonstração',
                dataInicio: '',
                prazoMeses: '12',
                nomeAssinante: '',
                cargoAssinante: ''
            });

            alert('Contrato gerado com sucesso!');
        } catch (error) {
            console.error('Erro ao gerar contrato:', error);
            alert('Erro ao gerar contrato. Verifique os dados e tente novamente.');
        }
    };

    return ( <
        form onSubmit = {
            handleSubmit
        }
        className = "contrato-form" >
        <
        div className = "form-section" >
        <
        h3 > Dados do Comodatário < /h3> <
            div className = "form-row" >
            <
            div className = "form-group col-md-6" >
            <
            label > Razão Social * < /label> <
            input
        type = "text"
        name = "nome"
        value = {
            formData.nome
        }
        onChange = {
            handleChange
        }
        required /
        >
        <
        /div> <
        div className = "form-group col-md-6" >
        <
        label > Nome Fantasia < /label> <
        input type = "text"
        name = "fantasia"
        value = {
            formData.fantasia
        }
        onChange = {
            handleChange
        }
        /> <
        /div> <
        /div>

        <
        div className = "form-row" >
        <
        div className = "form-group col-md-6" >
        <
        label > CNPJ * < /label> <
        input type = "text"
        name = "cnpj"
        value = {
            formData.cnpj
        }
        onChange = {
            handleChange
        }
        placeholder = "00.000.000/0000-00"
        required /
        >
        <
        /div> <
        div className = "form-group col-md-6" >
        <
        label > Inscrição Estadual < /label> <
        input type = "text"
        name = "ie"
        value = {
            formData.ie
        }
        onChange = {
            handleChange
        }
        /> <
        /div> <
        /div> <
        /div>

        <
        div className = "form-section" >
        <
        h3 > Endereço < /h3> <
        div className = "form-row" >
        <
        div className = "form-group col-md-4" >
        <
        label > CEP * < /label> <
        input type = "text"
        name = "cep"
        value = {
            formData.cep
        }
        onChange = {
            handleCEPChange
        }
        placeholder = "00000-000"
        required /
        >
        <
        /div> <
        div className = "form-group col-md-4" >
        <
        label > UF * < /label> <
        input type = "text"
        name = "uf"
        value = {
            formData.uf
        }
        onChange = {
            handleChange
        }
        maxLength = "2"
        required /
        >
        <
        /div> <
        div className = "form-group col-md-4" >
        <
        label > Cidade * < /label> <
        input type = "text"
        name = "cidade"
        value = {
            formData.cidade
        }
        onChange = {
            handleChange
        }
        required /
        >
        <
        /div> <
        /div>

        <
        div className = "form-row" >
        <
        div className = "form-group col-md-6" >
        <
        label > Bairro * < /label> <
        input type = "text"
        name = "bairro"
        value = {
            formData.bairro
        }
        onChange = {
            handleChange
        }
        required /
        >
        <
        /div> <
        div className = "form-group col-md-6" >
        <
        label > Endereço * < /label> <
        input type = "text"
        name = "endereco"
        value = {
            formData.endereco
        }
        onChange = {
            handleChange
        }
        required /
        >
        <
        /div> <
        /div>

        <
        div className = "form-row" >
        <
        div className = "form-group col-md-6" >
        <
        label > Número * < /label> <
        input type = "text"
        name = "numero"
        value = {
            formData.numero
        }
        onChange = {
            handleChange
        }
        required /
        >
        <
        /div> <
        div className = "form-group col-md-6" >
        <
        label > Complemento < /label> <
        input type = "text"
        name = "complemento"
        value = {
            formData.complemento
        }
        onChange = {
            handleChange
        }
        /> <
        /div> <
        /div> <
        /div>

        <
        div className = "form-section" >
        <
        h3 > Dados de Contato < /h3> <
        div className = "form-row" >
        <
        div className = "form-group col-md-6" >
        <
        label > Representante * < /label> <
        input type = "text"
        name = "representante"
        value = {
            formData.representante
        }
        onChange = {
            handleChange
        }
        required /
        >
        <
        /div> <
        div className = "form-group col-md-6" >
        <
        label > Cargo * < /label> <
        input type = "text"
        name = "cargo"
        value = {
            formData.cargo
        }
        onChange = {
            handleChange
        }
        required /
        >
        <
        /div> <
        /div>

        <
        div className = "form-row" >
        <
        div className = "form-group col-md-4" >
        <
        label > Telefone < /label> <
        input type = "text"
        name = "telefone"
        value = {
            formData.telefone
        }
        onChange = {
            handleChange
        }
        placeholder = "(00) 0000-0000" /
        >
        <
        /div> <
        div className = "form-group col-md-4" >
        <
        label > Celular * < /label> <
        input type = "text"
        name = "celular"
        value = {
            formData.celular
        }
        onChange = {
            handleChange
        }
        placeholder = "(00) 00000-0000"
        required /
        >
        <
        /div> <
        div className = "form-group col-md-4" >
        <
        label > E - mail * < /label> <
        input type = "email"
        name = "email"
        value = {
            formData.email
        }
        onChange = {
            handleChange
        }
        required /
        >
        <
        /div> <
        /div> <
        /div>

        <
        div className = "form-section" >
        <
        h3 > Dados do Equipamento < /h3> <
            div className = "form-row" >
            <
            div className = "form-group col-md-6" >
            <
            label > Equipamento * < /label> <
            input
        type = "text"
        name = "equipamento"
        value = {
            formData.equipamento
        }
        onChange = {
            handleChange
        }
        placeholder = "Ex: Paquímetro Digital"
        required /
        >
        <
        /div> <
        div className = "form-group col-md-6" >
        <
        label > Modelo < /label> <
        input type = "text"
        name = "modelo"
        value = {
            formData.modelo
        }
        onChange = {
            handleChange
        }
        /> <
        /div> <
        /div>

        <
        div className = "form-row" >
        <
        div className = "form-group col-md-12" >
        <
        label > Número de Série < /label> <
        input type = "text"
        name = "numeroSerie"
        value = {
            formData.numeroSerie
        }
        onChange = {
            handleChange
        }
        /> <
        /div> <
        /div>

        <
        div className = "form-row" >
        <
        div className = "form-group col-md-12" >
        <
        label > Descrição Técnica < /label> <
        textarea name = "descricaoTecnica"
        value = {
            formData.descricaoTecnica
        }
        onChange = {
            handleChange
        }
        rows = "3"
        placeholder = "Ex: Equipamento de medição dimensional com tecnologia digital..." /
        >
        <
        /div> <
        /div>

        <
        div className = "form-row" >
        <
        div className = "form-group col-md-6" >
        <
        label > Estado de Conservação * < /label> <
        select name = "estadoConservacao"
        value = {
            formData.estadoConservacao
        }
        onChange = {
            handleChange
        }
        required >
        <
        option value = "Novo" > Novo < /option> <
        option value = "Bom estado de funcionamento" > Bom estado de funcionamento < /option> <
        option value = "Estado de uso regular" > Estado de uso regular < /option> <
        option value = "Necessita manutenção" > Necessita manutenção < /option> <
        /select> <
        /div> <
        div className = "form-group col-md-6" >
        <
        label > Valor de Referência < /label> <
        input type = "text"
        name = "valorReferencia"
        value = {
            formData.valorReferencia
        }
        onChange = {
            handleChange
        }
        placeholder = "Ex: R$ 5.000,00" /
        >
        <
        /div> <
        /div>

        <
        div className = "form-row" >
        <
        div className = "form-group col-md-12" >
        <
        label > Acessórios < /label> <
        textarea name = "acessorios"
        value = {
            formData.acessorios
        }
        onChange = {
            handleChange
        }
        rows = "2"
        placeholder = "Ex: Cabo USB, manual de instruções, case de transporte..." /
        >
        <
        /div> <
        /div>

        <
        div className = "form-row" >
        <
        div className = "form-group col-md-12" >
        <
        label > Finalidade do Comodato * < /label> <
            textarea
        name = "finalidade"
        value = {
            formData.finalidade
        }
        onChange = {
            handleChange
        }
        rows = "2"
        required /
        >
        <
        /div> <
        /div> <
        /div>

        <
        div className = "form-section" >
        <
        h3 > Prazo do Contrato < /h3> <
            div className = "form-row" >
            <
            div className = "form-group col-md-6" >
            <
            label > Data de Início * < /label> <
            input
        type = "date"
        name = "dataInicio"
        value = {
            formData.dataInicio
        }
        onChange = {
            handleChange
        }
        required /
        >
        <
        /div> <
        div className = "form-group col-md-6" >
        <
        label > Prazo(meses) * < /label> <
        input type = "number"
        name = "prazoMeses"
        value = {
            formData.prazoMeses
        }
        onChange = {
            handleChange
        }
        min = "1"
        required /
        >
        <
        /div> <
        /div> <
        /div>

        <
        div className = "form-section" >
        <
        h3 > Assinante pelo Comodatário < /h3> <
        div className = "form-row" >
        <
        div className = "form-group col-md-6" >
        <
        label > Nome do Assinante * < /label> <
            input
        type = "text"
        name = "nomeAssinante"
        value = {
            formData.nomeAssinante
        }
        onChange = {
            handleChange
        }
        placeholder = "Nome completo"
        required /
        >
        <
        /div> <
        div className = "form-group col-md-6" >
        <
        label > Cargo do Assinante * < /label> <
            input
        type = "text"
        name = "cargoAssinante"
        value = {
            formData.cargoAssinante
        }
        onChange = {
            handleChange
        }
        placeholder = "Ex: Diretor, Gerente"
        required /
        >
        <
        /div> <
        /div> <
        /div>

        <
        button type = "submit"
        className = "btn-submit" > {
            contratoEditando ? 'Atualizar Contrato' : 'Gerar Contrato'
        } <
        /button> <
        /form>
    );
}

export default ContratoForm;