import React from 'react';
import './ListaContratos.css';

function ListaContratos({
    contratos,
    onEditarContrato
}) {
    return ( <
        div className = "lista-contratos-container" >
        <
        h2 > Histórico de Contratos Gerados < /h2>

        {
            contratos.length === 0 ? ( <
                    div className = "lista-vazia" >
                    <
                    p > Nenhum contrato gerado ainda. < /p> <
                    /div>
                ) : ( <
                    div className = "lista-contratos" > {
                        contratos.map((contrato) => ( <
                                div key = {
                                    contrato.id
                                }
                                className = "contrato-card" >
                                <
                                div className = "contrato-info" >
                                <
                                h3 > {
                                    contrato.nome
                                } < /h3> {
                                    contrato.fantasia && < p className = "fantasia" > {
                                            contrato.fantasia
                                        } < /p>} <
                                        p className = "equipamento" >
                                        <
                                        strong > Equipamento: < /strong> {contrato.equipamento} <
                                        /p> <
                                        p className = "data" >
                                        <
                                        strong > Gerado em: < /strong> {contrato.data} <
                                        /p> <
                                        /div> <
                                        div className = "contrato-acoes" >
                                        <
                                        button
                                    className = "btn-editar"
                                    onClick = {
                                        () => onEditarContrato(contrato)
                                    }
                                    title = "Editar e regerar contrato" >
                                        ✏️Editar <
                                        /button> <
                                        /div> <
                                        /div>
                                ))
                        } <
                        /div>
                    )
                } <
                /div>
        );
    }

    export default ListaContratos;