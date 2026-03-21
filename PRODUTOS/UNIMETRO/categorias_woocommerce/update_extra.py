import csv

# Ler o arquivo CSV
with open('woocommerce_import_completo.csv', 'r', encoding='utf-8') as file:
    content = file.read()

# Contador de atualizações
atualizacoes = 0

# EXTRA 200
desc_extra_200 = '''EXTRA 200 da Enterfix

EXTRA 200 oferece tecnologia intermediária em medição óptica para controle de qualidade industrial. Com área de medição de 200 x 100 x 150mm, combina precisão e facilidade de operação.

ESPECIFICAÇÕES TÉCNICAS:
• Faixa de medição: 200 x 100 x 150mm
• Precisão: 2.5 + L/200μm
• Repetibilidade: 1.8μm
• Peso: 145kg
• Dimensões: 580 x 480 x 825mm
• Câmera: CCD digital HD de 1,8M pixels
• Lente: Zoom semi-automático 0.6–5X
• Ampliação: 16–210X
• Campo de visão: 8.5–1.2mm
• Distância de trabalho: 92mm
• Resolução: 0.3μm
• Sistema: Semi-automático com software avançado
• Iluminação: LED industrial programável

CARACTERÍSTICAS:
- Medição óptica sem contato
- Precisão dimensional superior
- Software de medição intuitivo
- Interface moderna e eficiente
- Controle de qualidade confiável
- Fabricado pela Enterfix

APLICAÇÕES:
- Controle de qualidade industrial
- Inspeção dimensional de precisão
- Verificação de tolerâncias
- Medição sem contato
- Análise dimensional avançada'''

# EXTRA 300
desc_extra_300 = '''EXTRA 300 da Enterfix

EXTRA 300 oferece tecnologia intermediária em medição óptica para controle de qualidade industrial. Com área de medição de 300 x 200 x 150mm, combina precisão e facilidade de operação.

ESPECIFICAÇÕES TÉCNICAS:
• Faixa de medição: 300 x 200 x 150mm
• Precisão: 2.5 + L/200μm
• Repetibilidade: 1.8μm
• Peso: 195kg
• Dimensões: 680 x 580 x 925mm
• Câmera: CCD digital HD de 1,8M pixels
• Lente: Zoom semi-automático 0.6–5X
• Ampliação: 16–210X
• Campo de visão: 8.5–1.2mm
• Distância de trabalho: 92mm
• Resolução: 0.3μm
• Sistema: Semi-automático com software avançado
• Iluminação: LED industrial programável

CARACTERÍSTICAS:
- Medição óptica sem contato
- Precisão dimensional superior
- Software de medição intuitivo
- Interface moderna e eficiente
- Controle de qualidade confiável
- Fabricado pela Enterfix

APLICAÇÕES:
- Controle de qualidade industrial
- Inspeção dimensional de precisão
- Verificação de tolerâncias
- Medição sem contato
- Análise dimensional avançada'''

# EXTRA 400
desc_extra_400 = '''EXTRA 400 da Enterfix

EXTRA 400 oferece tecnologia intermediária em medição óptica para controle de qualidade industrial. Com área de medição de 400 x 300 x 200mm, combina precisão e facilidade de operação.

ESPECIFICAÇÕES TÉCNICAS:
• Faixa de medição: 400 x 300 x 200mm
• Precisão: 2.5 + L/200μm
• Repetibilidade: 1.8μm
• Peso: 255kg
• Dimensões: 780 x 680 x 1025mm
• Câmera: CCD digital HD de 1,8M pixels
• Lente: Zoom semi-automático 0.6–5X
• Ampliação: 16–210X
• Campo de visão: 8.5–1.2mm
• Distância de trabalho: 92mm
• Resolução: 0.3μm
• Sistema: Semi-automático com software avançado
• Iluminação: LED industrial programável

CARACTERÍSTICAS:
- Medição óptica sem contato
- Precisão dimensional superior
- Software de medição intuitivo
- Interface moderna e eficiente
- Controle de qualidade confiável
- Fabricado pela Enterfix

APLICAÇÕES:
- Controle de qualidade industrial
- Inspeção dimensional de precisão
- Verificação de tolerâncias
- Medição sem contato
- Análise dimensional avançada'''

# EXTRA 500
desc_extra_500 = '''EXTRA 500 da Enterfix

EXTRA 500 oferece tecnologia intermediária em medição óptica para controle de qualidade industrial. Com área de medição de 500 x 400 x 200mm, combina precisão e facilidade de operação.

ESPECIFICAÇÕES TÉCNICAS:
• Faixa de medição: 500 x 400 x 200mm
• Precisão: 2.5 + L/200μm
• Repetibilidade: 1.8μm
• Peso: 315kg
• Dimensões: 880 x 780 x 1125mm
• Câmera: CCD digital HD de 1,8M pixels
• Lente: Zoom semi-automático 0.6–5X
• Ampliação: 16–210X
• Campo de visão: 8.5–1.2mm
• Distância de trabalho: 92mm
• Resolução: 0.3μm
• Sistema: Semi-automático com software avançado
• Iluminação: LED industrial programável

CARACTERÍSTICAS:
- Medição óptica sem contato
- Precisão dimensional superior
- Software de medição intuitivo
- Interface moderna e eficiente
- Controle de qualidade confiável
- Fabricado pela Enterfix

APLICAÇÕES:
- Controle de qualidade industrial
- Inspeção dimensional de precisão
- Verificação de tolerâncias
- Medição sem contato
- Análise dimensional avançada'''

# Substituições
content = content.replace('[Inserir descrição WPBakery completa aqui]', desc_extra_200, 1)
atualizacoes += 1
print('EXTRA 200 atualizado')

content = content.replace('[Inserir descrição WPBakery completa aqui]', desc_extra_300, 1)
atualizacoes += 1
print('EXTRA 300 atualizado')

content = content.replace('[Inserir descrição WPBakery completa aqui]', desc_extra_400, 1)
atualizacoes += 1
print('EXTRA 400 atualizado')

content = content.replace('[Inserir descrição WPBakery completa aqui]', desc_extra_500, 1)
atualizacoes += 1
print('EXTRA 500 atualizado')

print(f'Total de atualizações: {atualizacoes}')

# Salvar o arquivo
with open('woocommerce_import_completo.csv', 'w', encoding='utf-8') as file:
    file.write(content)

print('Arquivo CSV atualizado com sucesso!')