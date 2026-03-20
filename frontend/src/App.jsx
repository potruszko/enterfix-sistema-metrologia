import { BrowserRouter, Routes, Route } from 'react-router-dom'
import Layout           from './components/Layout'
import Dashboard        from './pages/Dashboard'
import Blanks           from './pages/Blanks'
import Hastes           from './pages/Hastes'
import Esferas          from './pages/Esferas'
import MaoDeObra        from './pages/MaoDeObra'
import Produtos         from './pages/Produtos'
import ConstruirProduto from './pages/ConstruirProduto'
import Bling            from './pages/Bling'
import Configuracoes    from './pages/Configuracoes'
import Importar         from './pages/Importar'
import CentrosTrabalho  from './pages/CentrosTrabalho'
import OrdensProducao   from './pages/OrdensProducao'
import Operador         from './pages/Operador'

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<Layout />}>
          <Route index            element={<Dashboard />} />
          <Route path="blanks"    element={<Blanks />} />
          <Route path="hastes"    element={<Hastes />} />
          <Route path="esferas"   element={<Esferas />} />
          <Route path="mao-de-obra" element={<MaoDeObra />} />
          <Route path="produtos"  element={<Produtos />} />
          <Route path="construir" element={<ConstruirProduto />} />
          <Route path="bling"     element={<Bling />} />
          <Route path="configuracoes" element={<Configuracoes />} />
          <Route path="importar"      element={<Importar />} />
          <Route path="centros"        element={<CentrosTrabalho />} />
          <Route path="ordens"         element={<OrdensProducao />} />
          <Route path="operador"       element={<Operador />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
