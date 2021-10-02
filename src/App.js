import React from 'react';
import {Button, FormControl, Form, Alert, InputGroup} from "react-bootstrap";
const App = () => {
    const [tarefas, setTarefas] = React.useState([])
    const [statusSave, setStatusSave] = React.useState(false); 
    const [input, setInput] = React.useState("");
    const [erros, setErros] = React.useState([]);

    let count = React.useRef();
    let inputRef = React.useRef();

    React.useEffect(() => {
        let tarefas_local = JSON.parse(localStorage.getItem("tarefas"));
        if(tarefas_local) {
            setTarefas(tarefas_local);
        }
        let status = JSON.parse(localStorage.getItem("statusSave"));
        setStatusSave(status);
    }, [])

    React.useEffect(() => {
        if(statusSave) {
            localStorage.setItem("tarefas", JSON.stringify(tarefas));
        }
        else {
            localStorage.removeItem("tarefas");
        }
    }, [tarefas])

    React.useEffect(() => {
        localStorage.setItem("statusSave", JSON.stringify(statusSave));
        if(!statusSave) {
            localStorage.removeItem("tarefas");
        }
    }, [statusSave]);

    function adicionar() {
        if(input.length == 0) {
            gerarErro("É necessario preencher a tarefa para adicionar")
            return;
        }
        let tarefa = {
            id: Date.now(),
            label: input,
            cor: "#00ff1a"
        }
        setTarefas([...tarefas, tarefa])
        setInput("");
        inputRef.current.focus()
    }

    function changeColor(event, id_tarefa) {
        let n_tarefa = tarefas.map(el => {
            if(id_tarefa == el.id) {
                el.cor = event.target.value;
            }
            return el;
        })
        setTarefas(n_tarefa);
    }

    function gerarErro(erro) {
        clearTimeout(count.current)
        setErros([...erros, erro]);
        count.current = setTimeout(function() {
            setErros([])
        }, 1000)
    }

    function apagar(id) {
        let n_tarefas = tarefas.filter(tarefa => {
            if(tarefa.id !== id) {
                return tarefa;
            }
        })
        setTarefas(n_tarefas);
    }

    return (
        <div className="container">
            <div className="row mt-5">
                {erros.map((valor, indice) => (
                    <Alert variant="danger" key={indice}>
                        {valor}
                    </Alert>
                ))}
                <div className="col-lg-4">
                    <FormControl ref={inputRef} placeholder="Tarefa" value={input}
                    onChange={event => setInput(event.target.value)}
                    />
                </div>
                <div className="col-lg-2">
                    <Button onClick={adicionar}>Adicionar</Button>
                </div>
                <div className="col-lg-3">
                    <Form.Check
                    type="checkbox"
                    label="Manter dados ao sair"
                    checked={statusSave}
                    onChange={() => setStatusSave(!statusSave)}
                    />
                </div>
            </div>
            <div className="row mt-5">
                {tarefas.map(tarefa => {
                    return (
                        <div key={tarefa.id} className="col-lg-12 bg-light shadow row p-4 m-2">
                            <div className="col-lg-8">
                             <h3>{tarefa.label}</h3>
                            </div>
                            <div className="col-lg-2">
                            <Form.Control
                                type="color"
                                defaultValue={tarefa.cor}
                                onChange={evt => changeColor(evt, tarefa.id)}
                            />
                            </div>
                            <div className="col-lg-2">
                                <Button 
                                onClick={() => apagar(tarefa.id)}
                                variant="outline-danger" size="sm">Apagar</Button>
                            </div>
                        </div>
                    )
                })}
            </div>
        </div>
    )
}

export default App;