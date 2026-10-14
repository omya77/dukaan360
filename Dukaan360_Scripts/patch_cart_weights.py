with open('C:/Users/Omkar/Desktop/Dukaan360_Frontend/src/components/Cart.jsx', 'r', encoding='utf-8') as f:
    text = f.read()

import re

# We will inject the quick buttons after the entire div containing the quantity controls.
# Let's find the closing tag of that div.
old_block = """                    </div>
                  </div>
                </div>
              </div>"""

new_block = """                    </div>
                  </div>
                  {/* Quick Weight Buttons for Loose Items */}
                  {['kg', 'litre', 'gm', 'l'].includes(item.size?.toLowerCase()) && (
                    <div className="flex gap-1 mt-1.5 pt-1.5 border-t border-slate-100 w-full">
                      <button onClick={() => setExactQuantity(item.id, 0.25)} className="flex-1 bg-slate-50 hover:bg-brandLight hover:text-brand text-slate-600 text-[9px] lg:text-[10px] font-bold py-1 rounded transition border border-slate-200 hover:border-brand/30">पावशेर (0.25)</button>
                      <button onClick={() => setExactQuantity(item.id, 0.50)} className="flex-1 bg-slate-50 hover:bg-brandLight hover:text-brand text-slate-600 text-[9px] lg:text-[10px] font-bold py-1 rounded transition border border-slate-200 hover:border-brand/30">अर्धा (0.5)</button>
                      <button onClick={() => setExactQuantity(item.id, 0.75)} className="flex-1 bg-slate-50 hover:bg-brandLight hover:text-brand text-slate-600 text-[9px] lg:text-[10px] font-bold py-1 rounded transition border border-slate-200 hover:border-brand/30">पाऊण (0.75)</button>
                      <button onClick={() => setExactQuantity(item.id, 1.00)} className="flex-1 bg-slate-50 hover:bg-brandLight hover:text-brand text-slate-600 text-[9px] lg:text-[10px] font-bold py-1 rounded transition border border-slate-200 hover:border-brand/30">१ किलो</button>
                    </div>
                  )}
                </div>
              </div>"""

text = text.replace(old_block, new_block)

with open('C:/Users/Omkar/Desktop/Dukaan360_Frontend/src/components/Cart.jsx', 'w', encoding='utf-8') as f:
    f.write(text)

print('Done')
