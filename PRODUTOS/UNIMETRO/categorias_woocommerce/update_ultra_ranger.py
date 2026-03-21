import csv

# Ler o arquivo CSV
with open('woocommerce_import_completo.csv', 'r', encoding='utf-8') as file:
    content = file.read()

# Contador de atualizações
atualizacoes = 0

# ULTRA 200
desc_ultra_200 = '''ULTRA 200 da Enterfix

ULTRA 200 oferece a máxima precisão em medição óptica CNC para controle de qualidade industrial. Com área de medição de 200 x 100 x 150mm, representa o topo da linha Enterfix com tecnologia mais avançada.

ESPECIFICAÇÕES TÉCNICAS:
• Faixa de medição: 200 x 100 x 150mm
• Precisão: 2 + L/200μm
• Repetibilidade: 1.5μm
• Peso: 110kg
• Dimensões: 650 x 550 x 900mm
• Câmera: CCD GIGA digital de 2M pixels industrial
• Lente: Zoom automática industrial 0.5–6X
• Ampliação: 15–250X
• Campo de visão: 10.5–1.0mm
• Distância de trabalho: 95mm
• Resolução: 0.1μm
• Sistema: CNC totalmente automático + Software Rational DMIS
• Iluminação: LED industrial programável de alta intensidade

CARACTERÍSTICAS:
- Sistema CNC totalmente automático
- Máxima precisão dimensional
- Software Rational DMIS integrado
- Operação avançada e eficiente
- Controle de qualidade superior
- Fabricado pela Enterfix

APLICAÇÕES:
- Controle de qualidade de alta precisão
- Inspeção dimensional crítica
- Verificação de tolerâncias rigorosas
- Medição automática sem contato
- Análise dimensional avançada'''

# ULTRA 300
desc_ultra_300 = '''ULTRA 300 da Enterfix

ULTRA 300 oferece tecnologia CNC óptica avançada para máxima precisão em medição dimensional. Com área de medição de 300 x 200 x 200mm, é ideal para aplicações que exigem os mais altos padrões de qualidade.

ESPECIFICAÇÕES TÉCNICAS:
• Faixa de medição: 300 x 200 x 200mm
• Precisão: 2.5 + L/200μm
• Repetibilidade: 1.5μm
• Peso: 170kg
• Dimensões: 750 x 650 x 1000mm
• Câmera: CCD GIGA digital de 2M pixels industrial
• Lente: Zoom automática industrial 0.5–6X
• Ampliação: 15–250X
• Campo de visão: 10.5–1.0mm
• Distância de trabalho: 95mm
• Resolução: 0.1μm
• Sistema: CNC totalmente automático + Software Rational DMIS
• Iluminação: LED industrial programável de alta intensidade

CARACTERÍSTICAS:
- Sistema CNC totalmente automático
- Máxima precisão dimensional
- Software Rational DMIS integrado
- Operação avançada e eficiente
- Controle de qualidade superior
- Fabricado pela Enterfix

APLICAÇÕES:
- Controle de qualidade de alta precisão
- Inspeção dimensional crítica
- Verificação de tolerâncias rigorosas
- Medição automática sem contato
- Análise dimensional avançada'''

# ULTRA 400
desc_ultra_400 = '''ULTRA 400 da Enterfix

ULTRA 400 oferece tecnologia CNC óptica de ponta para máxima precisão em medição dimensional. Com área de medição de 400 x 300 x 200mm, atende às aplicações mais exigentes da indústria.

ESPECIFICAÇÕES TÉCNICAS:
• Faixa de medição: 400 x 300 x 200mm
• Precisão: 2.5 + L/200μm
• Repetibilidade: 1.5μm
• Peso: 230kg
• Dimensões: 850 x 750 x 1100mm
• Câmera: CCD GIGA digital de 2M pixels industrial
• Lente: Zoom automática industrial 0.5–6X
• Ampliação: 15–250X
• Campo de visão: 10.5–1.0mm
• Distância de trabalho: 95mm
• Resolução: 0.1μm
• Sistema: CNC totalmente automático + Software Rational DMIS
• Iluminação: LED industrial programável de alta intensidade

CARACTERÍSTICAS:
- Sistema CNC totalmente automático
- Máxima precisão dimensional
- Software Rational DMIS integrado
- Operação avançada e eficiente
- Controle de qualidade superior
- Fabricado pela Enterfix

APLICAÇÕES:
- Controle de qualidade de alta precisão
- Inspeção dimensional crítica
- Verificação de tolerâncias rigorosas
- Medição automática sem contato
- Análise dimensional avançada'''

# ULTRA 500
desc_ultra_500 = '''ULTRA 500 da Enterfix

ULTRA 500 oferece a mais avançada tecnologia CNC óptica para máxima precisão em grandes componentes. Com área de medição de 500 x 400 x 200mm, é a solução definitiva para medição de alta precisão.

ESPECIFICAÇÕES TÉCNICAS:
• Faixa de medição: 500 x 400 x 200mm
• Precisão: 2.5 + L/200μm
• Repetibilidade: 1.5μm
• Peso: 320kg
• Dimensões: 950 x 850 x 1200mm
• Câmera: CCD GIGA digital de 2M pixels industrial
• Lente: Zoom automática industrial 0.5–6X
• Ampliação: 15–250X
• Campo de visão: 10.5–1.0mm
• Distância de trabalho: 95mm
• Resolução: 0.1μm
• Sistema: CNC totalmente automático + Software Rational DMIS
• Iluminação: LED industrial programável de alta intensidade

CARACTERÍSTICAS:
- Sistema CNC totalmente automático
- Máxima precisão dimensional
- Software Rational DMIS integrado
- Operação avançada e eficiente
- Controle de qualidade superior
- Fabricado pela Enterfix

APLICAÇÕES:
- Controle de qualidade de alta precisão
- Inspeção dimensional crítica
- Verificação de tolerâncias rigorosas
- Medição automática sem contato
- Análise dimensional avançada'''

# RANGER 200
desc_ranger_200 = '''RANGER 200 da Enterfix

RANGER 200 é especializada na medição de ferramentas rotativas com área de 200 x 150 x 100mm. Desenvolvida especificamente para fabricantes de ferramentas que necessitam de inspeção precisa de fresas, brocas e escareadores.

ESPECIFICAÇÕES TÉCNICAS:
• Faixa de medição: 200 x 150 x 100mm
• Precisão: 2.5 + L/200μm
• Repetibilidade: 2μm
• Peso: 280kg
• Dimensões: 850 x 650 x 1150mm
• Câmera: CCD digital especializada de 2M pixels
• Lente: Zoom automático para ferramentas 0.5–8X
• Ampliação: 12–300X
• Campo de visão: Variable conforme ferramenta
• Distância de trabalho: 85mm
• Resolução: 0.2μm
• Sistema: Software especializado para ferramentas
• Iluminação: LED programável com múltiplos ângulos

CARACTERÍSTICAS:
- Especializada em ferramentas rotativas
- Software específico para análise de geometrias
- Medição de ângulos e perfis complexos
- Interface otimizada para ferramentas
- Controle de qualidade especializado
- Fabricado pela Enterfix

APLICAÇÕES:
- Medição de fresas e brocas
- Inspeção de escareadores e alargadores
- Controle de qualidade de ferramentas
- Verificação de ângulos de corte
- Análise dimensional de ferramentas'''

# RANGER 600
desc_ranger_600 = '''RANGER 600 da Enterfix

RANGER 600 oferece inspeção universal de ferramentas de corte com software SMARTOOL avançado. Solução completa para fabricantes que necessitam de análise detalhada de brocas, fresas e alargadores.

ESPECIFICAÇÕES TÉCNICAS:
• Faixa de medição: Universal para ferramentas
• Precisão: 2 + L/200μm
• Repetibilidade: 1.5μm
• Peso: 350kg
• Dimensões: 1000 x 800 x 1200mm
• Câmera: CCD digital premium de 3M pixels
• Lente: Zoom automático universal 0.3–10X
• Ampliação: 10–400X
• Campo de visão: Variable conforme aplicação
• Distância de trabalho: 90mm
• Resolução: 0.1μm
• Sistema: Software SMARTOOL especializado
• Iluminação: LED programável com controle angular

CARACTERÍSTICAS:
- Inspeção universal de ferramentas
- Software SMARTOOL avançado
- Análise completa de geometrias
- Medição automatizada de parâmetros
- Controle de qualidade superior
- Fabricado pela Enterfix

APLICAÇÕES:
- Inspeção universal de ferramentas de corte
- Análise dimensional completa
- Verificação de parâmetros geométricos
- Controle de qualidade automatizado
- Medição de ferramentas complexas'''

# Continuarei com os demais produtos...
print("Iniciando atualizações...")

# Substituições sequenciais
content = content.replace('[Inserir descrição WPBakery completa aqui]', desc_ultra_200, 1)
atualizacoes += 1
print('ULTRA 200 atualizado')

content = content.replace('[Inserir descrição WPBakery completa aqui]', desc_ultra_300, 1)
atualizacoes += 1
print('ULTRA 300 atualizado')

content = content.replace('[Inserir descrição WPBakery completa aqui]', desc_ultra_400, 1)
atualizacoes += 1
print('ULTRA 400 atualizado')

content = content.replace('[Inserir descrição WPBakery completa aqui]', desc_ultra_500, 1)
atualizacoes += 1
print('ULTRA 500 atualizado')

content = content.replace('[Inserir descrição WPBakery completa aqui]', desc_ranger_200, 1)
atualizacoes += 1
print('RANGER 200 atualizado')

content = content.replace('[Inserir descrição WPBakery completa aqui]', desc_ranger_600, 1)
atualizacoes += 1
print('RANGER 600 atualizado')

print(f'Primeira parte concluída: {atualizacoes} atualizações')

# Salvar o arquivo
with open('woocommerce_import_completo.csv', 'w', encoding='utf-8') as file:
    file.write(content)

print('Arquivo CSV atualizado com sucesso!')