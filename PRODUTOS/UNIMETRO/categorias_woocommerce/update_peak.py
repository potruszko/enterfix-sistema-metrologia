import csv

# Ler o arquivo CSV
with open('woocommerce_import_completo.csv', 'r', encoding='utf-8') as file:
    content = file.read()

# Contador de atualizações
atualizacoes = 0

# PEAK 300
desc_peak_300 = '''PEAK 300 da Enterfix

PEAK 300 oferece tecnologia de alta precisão em medição óptica para controle de qualidade industrial. Com área de medição de 300 x 200 x 150mm, é ideal para aplicações que exigem máxima precisão.

ESPECIFICAÇÕES TÉCNICAS:
• Faixa de medição: 300 x 200 x 150mm
• Precisão: 2.2 + L/200μm
• Repetibilidade: 1.5μm
• Peso: 205kg
• Dimensões: 690 x 590 x 935mm
• Câmera: CCD digital premium de 2M pixels
• Lente: Zoom automático de precisão 0.5–6X
• Ampliação: 14–240X
• Campo de visão: 9.2–1.0mm
• Distância de trabalho: 94mm
• Resolução: 0.2μm
• Sistema: Automático com software premium
• Iluminação: LED industrial programável de alta intensidade

CARACTERÍSTICAS:
- Medição óptica sem contato de alta precisão
- Precisão dimensional excepcional
- Software de medição premium
- Interface avançada e intuitiva
- Controle de qualidade superior
- Fabricado pela Enterfix

APLICAÇÕES:
- Controle de qualidade industrial de precisão
- Inspeção dimensional crítica
- Verificação de tolerâncias apertadas
- Medição sem contato de alta exatidão
- Análise dimensional avançada'''

# PEAK 400
desc_peak_400 = '''PEAK 400 da Enterfix

PEAK 400 oferece tecnologia de alta precisão em medição óptica para controle de qualidade industrial. Com área de medição de 400 x 300 x 200mm, é ideal para aplicações que exigem máxima precisão.

ESPECIFICAÇÕES TÉCNICAS:
• Faixa de medição: 400 x 300 x 200mm
• Precisão: 2.2 + L/200μm
• Repetibilidade: 1.5μm
• Peso: 265kg
• Dimensões: 790 x 690 x 1035mm
• Câmera: CCD digital premium de 2M pixels
• Lente: Zoom automático de precisão 0.5–6X
• Ampliação: 14–240X
• Campo de visão: 9.2–1.0mm
• Distância de trabalho: 94mm
• Resolução: 0.2μm
• Sistema: Automático com software premium
• Iluminação: LED industrial programável de alta intensidade

CARACTERÍSTICAS:
- Medição óptica sem contato de alta precisão
- Precisão dimensional excepcional
- Software de medição premium
- Interface avançada e intuitiva
- Controle de qualidade superior
- Fabricado pela Enterfix

APLICAÇÕES:
- Controle de qualidade industrial de precisão
- Inspeção dimensional crítica
- Verificação de tolerâncias apertadas
- Medição sem contato de alta exatidão
- Análise dimensional avançada'''

# Substituições
content = content.replace('[Inserir descrição WPBakery completa aqui]', desc_peak_300, 1)
atualizacoes += 1
print('PEAK 300 atualizado')

content = content.replace('[Inserir descrição WPBakery completa aqui]', desc_peak_400, 1)
atualizacoes += 1
print('PEAK 400 atualizado')

print(f'Total de atualizações: {atualizacoes}')

# Salvar o arquivo
with open('woocommerce_import_completo.csv', 'w', encoding='utf-8') as file:
    file.write(content)

print('Arquivo CSV atualizado com sucesso!')