"use client"
import { Save } from 'lucide-react';
import { use, useState } from 'react';
export default function Cadastro(){

    /* Estado para o Formulário de Cadastro */
    const [ formData, setFormData] = useState({
        nome: '',
        email:'',
        cargo:'',
        setor: ''
    })
    /*Estado para armazenar os funcionários */
    const [listFuncioarios, setListFuncionarios] = useState([
        { id: 1, nome: 'Maria', cargo: 'Operadora', setor: 'Produção'}
    ])

    /* Função para mapear as mudanças nos inputs */
    const handleChange = (e: Event) => {
        const { name, value } = e.target
        setFormData((prev) => (
            {
                ...prev,
                [name]:value
            }
        ))
    }
    /* Função para Salvar os dados para o servidor */
    const handleSubmit = (e: Event) => {
        e.preventDefault()
        const novo_funcionario = {
            ...formData,
            id: Date.now()
        }
        setListFuncionarios([...listFuncioarios, novo_funcionario]);
        // limpeza de estado
        setFormData({
            nome: '', email: '', cargo: '', setor: ''
        })
        alert('Funcionário cadastrado com sucesso!')
    }

    return (
        <div className="app-container">
            <main className="main">
                <header className="header">

                </header>
                <div className="content">
                    {/* -- formulário -- */}
                    <div style={{ maxWidth: '900px', margin : '0 auto'}}>
                        <div className="card">
                            <h2>Novo Funcionário</h2>
                            <p style={{color:'#64748b', marginBottom: '20px'}}>
                                Preencha os dados abaixo para registrar no sistema.
                            </p>
                            <form onSubmit={handleSubmit}>
                                <div className="form-grid">
                                    <div className="form-group">
                                        <label htmlFor="">Nome Completo</label>
                                        <input
                                            type="text"
                                            name="nome"
                                            id=""
                                            onChange={handleChange}
                                            placeholder="Ex.: João Silva"
                                            
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="">E-mail Corporativo</label>
                                        <input
                                            type="email"
                                            name="email"
                                            id=""
                                            onChange={handleChange}
                                            placeholder="Ex.:joao@empresa.com"
                                            
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="">Cargo</label>
                                        <input
                                            type="text"
                                            name="cargo"
                                            id=""
                                            onChange={handleChange}
                                            placeholder="Ex.: Operador de Máquina"
                                        />
                                    </div>
                                    <div className="form-group">
                                        <label htmlFor="">Setor</label>
                                        <select name="setor" id="" onChange={handleChange}>
                                            <option value="Produção">Produção</option>
                                            <option value="Manutenção">Manutenção</option>
                                            <option value="Logística">Logística</option>
                                            <option value="Qualidade">Qualidade</option>
                                        </select>
                                    </div>
                                </div>
                                <button type="submit" className="btn-submit">
                                    <Save size={18} />
                                    Salvar Cadastro
                                </button>
                            </form>
                        </div>
                        <div className='table-container' style={{ marginTop: '30px'}}>
                            <h3>Funcionários Cadastrados</h3>
                            <table>
                                <thead>
                                    <tr>
                                        <th>Nome</th>
                                        <th>Cargo</th>
                                        <th>Setor</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {listFuncioarios.map((funcionario) => (
                                        <tr key={funcionario.id}>
                                            <td>{funcionario.nome}</td>
                                            <td>{funcionario.cargo}</td>
                                            <td><span style={{background: '#f1f5f9', padding: '4px 8px', borderRadius: '4px'}}>{funcionario.setor}</span></td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    )
}