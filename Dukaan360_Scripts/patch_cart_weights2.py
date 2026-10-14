with open('C:/Users/Omkar/Desktop/Dukaan360_Frontend/src/components/Cart.jsx', 'r', encoding='utf-8') as f:
    text = f.read()

text = text.replace(
    "{['kg', 'litre', 'gm', 'l'].includes(item.size?.toLowerCase()) && (",
    "{true && ("
)

with open('C:/Users/Omkar/Desktop/Dukaan360_Frontend/src/components/Cart.jsx', 'w', encoding='utf-8') as f:
    f.write(text)

print('Done')
