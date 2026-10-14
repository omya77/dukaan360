with open('C:/Users/Omkar/Desktop/Dukaan360_Frontend/src/components/Cart.jsx', 'r', encoding='utf-8') as f:
    text = f.read()

text = text.replace('min="0"', '')

trash_btn = '''<div className="flex items-center gap-1.5">
                      <button onClick={() => updateQuantity(item.id, 'remove')} className="text-red-400 hover:text-red-500 transition mr-1">
                        <X weight="bold" />
                      </button>
                      <div className="flex items-center gap-0.5 bg-white border border-slate-200 rounded px-1 py-0.5 shadow-sm">'''

text = text.replace('<div className="flex items-center gap-0.5 bg-white border border-slate-200 rounded px-1 py-0.5 shadow-sm">', trash_btn)

text = text.replace('</button>\n                    </div>\n                  </div>', '</button>\n                    </div>\n                    </div>\n                  </div>')

with open('C:/Users/Omkar/Desktop/Dukaan360_Frontend/src/components/Cart.jsx', 'w', encoding='utf-8') as f:
    f.write(text)

print('Done')
