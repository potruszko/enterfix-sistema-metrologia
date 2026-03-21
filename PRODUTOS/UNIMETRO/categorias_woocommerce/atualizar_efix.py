import re

# Ler arquivo E-FIX
with open('../sistemas_fixacao/efix_wpbakery_description.txt', 'r', encoding='utf-8') as f:
    content = f.read()

# Remover estilos das células td
content = re.sub(r'style="border: 1px solid #dddddd; padding: 8px;"', '', content)

# Também trocar * por × nas dimensões
content = content.replace('6*5mm', '6×5mm')
content = content.replace('6*10mm', '6×10mm') 
content = content.replace('6*25mm', '6×25mm')
content = content.replace('9*5mm', '9×5mm')
content = content.replace('9*10mm', '9×10mm')
content = content.replace('9*20mm', '9×20mm')
content = content.replace('9*25mm', '9×25mm')
content = content.replace('12*10mm', '12×10mm')
content = content.replace('12*25mm', '12×25mm')

# Salvar arquivo atualizado
with open('../sistemas_fixacao/efix_wpbakery_description.txt', 'w', encoding='utf-8') as f:
    f.write(content)

print('✅ Tabela E-FIX atualizada com CSS class!')