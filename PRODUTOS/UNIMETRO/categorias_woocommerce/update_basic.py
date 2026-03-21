import csv
import re

# Ler o arquivo CSV
with open('woocommerce_import_completo.csv', 'r', encoding='utf-8') as file:
    content = file.read()

# Contador de atualizações
atualizacoes = 0

# BASIC 400
desc_basic_400 = '''BASIC 400 da Enterfix

BASIC 400 oferece tecnologia avançada em medição óptica para controle de qualidade industrial. Com área de medição de 400 x 300 x 200mm, é ideal para inspeção dimensional precisa sem contato.

ESPECIFICAÇÕES TÉCNICAS:
• Faixa de medição: 400 x 300 x 200mm
• Precisão: 3 + L/200μm
• Repetibilidade: 2μm
• Peso: 280kg
• Dimensões: 810 x 710 x 1055mm
• Câmera: CCD digital HD de 1,3M pixels
• Lente: Zoom manual 0.7–4.5X
• Ampliação: 18–195X
• Campo de visão: 8.1–1.3mm
• Distância de trabalho: 90mm
• Resolução: 0.5μm
• Sistema: Manual com controles precisos
• Iluminação: LED industrial programável

CARACTERÍSTICAS:
- Medição óptica sem contato
- Precisão dimensional excepcional
- Software de medição avançado
- Interface intuitiva e eficiente
- Controle de qualidade confiável
- Fabricado pela Enterfix

APLICAÇÕES:
- Controle de qualidade industrial
- Inspeção dimensional de precisão
- Verificação de tolerâncias
- Medição sem contato
- Análise dimensional avançada'''

# BASIC 500
desc_basic_500 = '''BASIC 500 da Enterfix

BASIC 500 oferece tecnologia avançada em medição óptica para controle de qualidade industrial. Com área de medição de 500 x 400 x 200mm, é ideal para inspeção dimensional precisa sem contato.

ESPECIFICAÇÕES TÉCNICAS:
• Faixa de medição: 500 x 400 x 200mm
• Precisão: 3 + L/200μm
• Repetibilidade: 2μm
• Peso: 350kg
• Dimensões: 910 x 810 x 1155mm
• Câmera: CCD digital HD de 1,3M pixels
• Lente: Zoom manual 0.7–4.5X
• Ampliação: 18–195X
• Campo de visão: 8.1–1.3mm
• Distância de trabalho: 90mm
• Resolução: 0.5μm
• Sistema: Manual com controles precisos
• Iluminação: LED industrial programável

CARACTERÍSTICAS:
- Medição óptica sem contato
- Precisão dimensional excepcional
- Software de medição avançado
- Interface intuitiva e eficiente
- Controle de qualidade confiável
- Fabricado pela Enterfix

APLICAÇÕES:
- Controle de qualidade industrial
- Inspeção dimensional de precisão
- Verificação de tolerâncias
- Medição sem contato
- Análise dimensional avançada'''

# Substituições
content = content.replace('[Inserir descrição WPBakery completa aqui]', desc_basic_400, 1)
atualizacoes += 1
print('BASIC 400 atualizado')

content = content.replace('[Inserir descrição WPBakery completa aqui]', desc_basic_500, 1)
atualizacoes += 1
print('BASIC 500 atualizado')

print(f'Total de atualizações: {atualizacoes}')

# Salvar o arquivo
with open('woocommerce_import_completo.csv', 'w', encoding='utf-8') as file:
    file.write(content)

print('Arquivo CSV atualizado com sucesso!')