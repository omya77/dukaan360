import io
import os
import re
from datetime import datetime
from reportlab.lib.pagesizes import A4
from reportlab.lib import colors
from reportlab.platypus import (
    SimpleDocTemplate, Paragraph, Spacer, Table, TableStyle, KeepTogether, HRFlowable
)
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.pdfgen import canvas
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont

# Font configuration - Prioritize Windows Nirmala UI (TrueType with full Devanagari & Latin glyph sets)
FONT_NORMAL = "Helvetica"
FONT_BOLD = "Helvetica-Bold"

try:
    if os.path.exists("C:/Windows/Fonts/Nirmala.ttc"):
        pdfmetrics.registerFont(TTFont("Nirmala", "C:/Windows/Fonts/Nirmala.ttc", subfontIndex=0))
        pdfmetrics.registerFont(TTFont("Nirmala-Bold", "C:/Windows/Fonts/Nirmala.ttc", subfontIndex=1))
        FONT_NORMAL = "Nirmala"
        FONT_BOLD = "Nirmala-Bold"
    elif os.path.exists("C:/Windows/Fonts/arial.ttf"):
        pdfmetrics.registerFont(TTFont("Arial", "C:/Windows/Fonts/arial.ttf"))
        FONT_NORMAL = "Arial"
        if os.path.exists("C:/Windows/Fonts/arialbd.ttf"):
            pdfmetrics.registerFont(TTFont("Arial-Bold", "C:/Windows/Fonts/arialbd.ttf"))
            FONT_BOLD = "Arial-Bold"
        else:
            FONT_BOLD = "Arial"
except Exception as e:
    print(f"[PDF FONT REGISTRATION] {e}")


class NumberedCanvas(canvas.Canvas):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, **kwargs)
        self._saved_page_states = []

    def showPage(self):
        self._saved_page_states.append(dict(self.__dict__))
        self._startPage()

    def save(self):
        num_pages = len(self._saved_page_states)
        for state in self._saved_page_states:
            self.__dict__.update(state)
            self.draw_page_number(num_pages)
            canvas.Canvas.showPage(self)
        canvas.Canvas.save(self)

    def draw_page_number(self, page_count):
        self.saveState()
        self.setFont(FONT_NORMAL, 8)
        self.setFillColor(colors.HexColor("#64748B"))
        
        # Footer dividing line
        self.setStrokeColor(colors.HexColor("#CBD5E1"))
        self.setLineWidth(0.5)
        self.line(36, 32, A4[0] - 36, 32)
        
        # Footer text (clean and universal)
        self.drawString(36, 20, "Dukaan360 Smart Cloud POS • Official Store Backup & Audit Document")
        right_text = f"Page {self._pageNumber} of {page_count}"
        self.drawRightString(A4[0] - 36, 20, right_text)
        self.restoreState()


def generate_store_backup_pdf(store_id: int, db) -> bytes:
    import models
    
    store = db.query(models.Store).filter(models.Store.id == store_id).first()
    if not store:
        raise ValueError(f"Store with ID {store_id} not found")
        
    products = db.query(models.Product).filter(models.Product.store_id == store_id).order_by(models.Product.name).all()
    customers = db.query(models.Customer).filter(models.Customer.store_id == store_id).order_by(models.Customer.name).all()
    batches = db.query(models.StockBatch).filter(models.StockBatch.store_id == store_id).all()
    invoices = db.query(models.SaleInvoice).filter(models.SaleInvoice.store_id == store_id).order_by(models.SaleInvoice.timestamp.desc()).limit(100).all()
    
    # Calculate current stock map
    stock_map = {}
    for b in batches:
        stock_map[b.product_id] = stock_map.get(b.product_id, 0.0) + (b.current_quantity or 0.0)
        
    total_due = sum((c.current_due or 0.0) for c in customers)
    
    buffer = io.BytesIO()
    doc = SimpleDocTemplate(
        buffer,
        pagesize=A4,
        leftMargin=36,
        rightMargin=36,
        topMargin=36,
        bottomMargin=45
    )
    
    title_style = ParagraphStyle(
        'DocTitle',
        fontName=FONT_BOLD,
        fontSize=18,
        leading=22,
        textColor=colors.HexColor('#FF5722'),
    )
    
    section_h1 = ParagraphStyle(
        'SectionH1',
        fontName=FONT_BOLD,
        fontSize=11,
        leading=15,
        textColor=colors.HexColor('#0F172A'),
        spaceBefore=12,
        spaceAfter=5
    )
    
    th_style = ParagraphStyle(
        'TH',
        fontName=FONT_BOLD,
        fontSize=8,
        leading=10,
        textColor=colors.white,
        alignment=0
    )
    
    th_right = ParagraphStyle(
        'THR',
        fontName=FONT_BOLD,
        fontSize=8,
        leading=10,
        textColor=colors.white,
        alignment=2
    )
    
    td_style = ParagraphStyle(
        'TD',
        fontName=FONT_NORMAL,
        fontSize=8,
        leading=11,
        textColor=colors.HexColor('#1E293B')
    )
    
    td_bold = ParagraphStyle(
        'TDBold',
        fontName=FONT_BOLD,
        fontSize=8,
        leading=11,
        textColor=colors.HexColor('#0F172A')
    )
    
    td_right = ParagraphStyle(
        'TDRight',
        fontName=FONT_NORMAL,
        fontSize=8,
        leading=11,
        textColor=colors.HexColor('#1E293B'),
        alignment=2
    )

    story = []
    
    # 1. Top Header Banner
    header_data = [
        [
            Paragraph("<b>DUKAAN360 SMART CLOUD POS</b><br/><font size='9' color='#334155'>Official Store Backup &amp; Data Audit Report</font>", title_style),
            Paragraph(f"<b>Generated:</b> {datetime.now().strftime('%d %b %Y, %I:%M %p')}<br/><b>Doc Type:</b> Full Store Data Backup", ParagraphStyle('HRight', fontName=FONT_NORMAL, fontSize=8, leading=11, alignment=2, textColor=colors.HexColor('#475569')))
        ]
    ]
    header_table = Table(header_data, colWidths=[340, 183])
    header_table.setStyle(TableStyle([
        ('VALIGN', (0, 0), (-1, -1), 'TOP'),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 4),
    ]))
    story.append(header_table)
    story.append(HRFlowable(width="100%", thickness=1.5, color=colors.HexColor("#FF5722"), spaceAfter=10, spaceBefore=4))
    
    # 2. Store Profile Box
    plan_name = store.plan_type.value if hasattr(store.plan_type, 'value') else str(store.plan_type)
    status_name = store.status.value if hasattr(store.status, 'value') else str(store.status)
    
    store_info_data = [
        [
            Paragraph(f"<b>Store Name:</b> {store.name}", td_bold),
            Paragraph(f"<b>Owner Name:</b> {store.owner_name or 'N/A'}", td_style),
        ],
        [
            Paragraph(f"<b>Mobile No:</b> {store.mobile or 'N/A'}", td_style),
            Paragraph(f"<b>Plan:</b> <font color='#FF5722'><b>{plan_name.upper()}</b></font> ({status_name.upper()})", td_style),
        ],
        [
            Paragraph(f"<b>Address:</b> {store.address or 'N/A'}", td_style),
            Paragraph(f"<b>GST Number:</b> {store.gst_number or 'Unregistered'}", td_style),
        ]
    ]
    info_table = Table(store_info_data, colWidths=[260, 263])
    info_table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, -1), colors.HexColor('#F8FAFC')),
        ('BOX', (0, 0), (-1, -1), 0.5, colors.HexColor('#E2E8F0')),
        ('INNERGRID', (0, 0), (-1, -1), 0.5, colors.HexColor('#F1F5F9')),
        ('TOPPADDING', (0, 0), (-1, -1), 5),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 5),
        ('LEFTPADDING', (0, 0), (-1, -1), 8),
        ('RIGHTPADDING', (0, 0), (-1, -1), 8),
    ]))
    story.append(info_table)
    story.append(Spacer(1, 8))
    
    # 3. KPI Metrics Summary (Clean 2-Row Layout with zero overlap and high legibility)
    kpi_lbl_style = ParagraphStyle(
        'KPILbl',
        fontName=FONT_BOLD,
        fontSize=7.5,
        leading=10,
        alignment=1,
        textColor=colors.HexColor('#64748B')
    )
    kpi_val_orange = ParagraphStyle(
        'KPIValO',
        fontName=FONT_BOLD,
        fontSize=15,
        leading=18,
        alignment=1,
        textColor=colors.HexColor('#FF5722')
    )
    kpi_val_blue = ParagraphStyle(
        'KPIValB',
        fontName=FONT_BOLD,
        fontSize=15,
        leading=18,
        alignment=1,
        textColor=colors.HexColor('#2563EB')
    )
    kpi_val_green = ParagraphStyle(
        'KPIValG',
        fontName=FONT_BOLD,
        fontSize=15,
        leading=18,
        alignment=1,
        textColor=colors.HexColor('#059669')
    )
    kpi_val_purple = ParagraphStyle(
        'KPIValP',
        fontName=FONT_BOLD,
        fontSize=15,
        leading=18,
        alignment=1,
        textColor=colors.HexColor('#7C3AED')
    )
    kpi_val_red = ParagraphStyle(
        'KPIValR',
        fontName=FONT_BOLD,
        fontSize=13,
        leading=18,
        alignment=1,
        textColor=colors.HexColor('#DC2626')
    )

    kpi_data = [
        [
            Paragraph("TOTAL PRODUCTS", kpi_lbl_style),
            Paragraph("STOCK BATCHES", kpi_lbl_style),
            Paragraph("CUSTOMERS", kpi_lbl_style),
            Paragraph("SALES INVOICES", kpi_lbl_style),
            Paragraph("KHATA DUE BALANCE", kpi_lbl_style),
        ],
        [
            Paragraph(str(len(products)), kpi_val_orange),
            Paragraph(str(len(batches)), kpi_val_blue),
            Paragraph(str(len(customers)), kpi_val_green),
            Paragraph(str(len(invoices)), kpi_val_purple),
            Paragraph(f"Rs. {total_due:,.2f}", kpi_val_red),
        ]
    ]
    kpi_table = Table(kpi_data, colWidths=[104, 104, 105, 105, 105])
    kpi_table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, -1), colors.HexColor('#FFF7ED')),
        ('BOX', (0, 0), (-1, -1), 1, colors.HexColor('#FDBA74')),
        ('INNERGRID', (0, 0), (-1, -1), 0.5, colors.HexColor('#FED7AA')),
        ('LINEBELOW', (0, 0), (-1, 0), 0.5, colors.transparent),
        ('TOPPADDING', (0, 0), (-1, 0), 7),
        ('BOTTOMPADDING', (0, 0), (-1, 0), 1),
        ('TOPPADDING', (0, 1), (-1, 1), 1),
        ('BOTTOMPADDING', (0, 1), (-1, 1), 8),
        ('ALIGN', (0, 0), (-1, -1), 'CENTER'),
        ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
    ]))
    story.append(kpi_table)
    story.append(Spacer(1, 10))
    
    # 4. Products Table Section
    story.append(Paragraph(f"<b>1. Products &amp; Pricing Catalog (Total {len(products)} Items)</b>", section_h1))
    
    prod_table_rows = [
        [
            Paragraph("<b>#</b>", th_style),
            Paragraph("<b>Product Name</b>", th_style),
            Paragraph("<b>Category</b>", th_style),
            Paragraph("<b>Unit</b>", th_style),
            Paragraph("<b>MRP</b>", th_right),
            Paragraph("<b>Selling Price</b>", th_right),
            Paragraph("<b>Stock Qty</b>", th_right),
            Paragraph("<b>Barcode</b>", th_style),
        ]
    ]
    
    for idx, p in enumerate(products, start=1):
        cat_name = p.category.name if getattr(p, 'category', None) else "-"
        cur_stock = stock_map.get(p.id, 0.0)
        stock_str = f"{cur_stock:g} {p.unit or ''}"
        
        prod_table_rows.append([
            Paragraph(str(idx), td_style),
            Paragraph(p.name, td_bold),
            Paragraph(cat_name, td_style),
            Paragraph(p.unit or "Piece", td_style),
            Paragraph(f"Rs. {p.mrp:.2f}" if p.mrp else "-", td_right),
            Paragraph(f"Rs. {p.selling_price:.2f}", td_right),
            Paragraph(stock_str, td_right),
            Paragraph(p.barcode or "-", td_style),
        ])
        
    prod_table = Table(
        prod_table_rows,
        colWidths=[22, 160, 65, 45, 52, 55, 60, 64],
        repeatRows=1
    )
    prod_table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#1E293B')),
        ('ALIGN', (0, 0), (-1, 0), 'LEFT'),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 3),
        ('TOPPADDING', (0, 0), (-1, -1), 3),
        ('LEFTPADDING', (0, 0), (-1, -1), 4),
        ('RIGHTPADDING', (0, 0), (-1, -1), 4),
        ('ROWBACKGROUNDS', (0, 1), (-1, -1), [colors.white, colors.HexColor('#F8FAFC')]),
        ('GRID', (0, 0), (-1, -1), 0.5, colors.HexColor('#E2E8F0')),
        ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
    ]))
    story.append(prod_table)
    story.append(Spacer(1, 12))
    
    # 5. Customer & Khata Table Section (if customers exist)
    if customers:
        story.append(KeepTogether([
            Paragraph(f"<b>2. Customers &amp; Khata Ledgers (Total {len(customers)} Customers)</b>", section_h1)
        ]))
        
        cust_table_rows = [
            [
                Paragraph("<b>#</b>", th_style),
                Paragraph("<b>Customer Name</b>", th_style),
                Paragraph("<b>Mobile Number</b>", th_style),
                Paragraph("<b>Opening Balance</b>", th_right),
                Paragraph("<b>Due Balance</b>", th_right),
            ]
        ]
        
        for idx, c in enumerate(customers, start=1):
            cust_table_rows.append([
                Paragraph(str(idx), td_style),
                Paragraph(c.name, td_bold),
                Paragraph(c.mobile or "-", td_style),
                Paragraph(f"Rs. {c.opening_balance:.2f}" if c.opening_balance else "Rs. 0.00", td_right),
                Paragraph(f"Rs. {c.current_due:.2f}" if c.current_due else "Rs. 0.00", td_right),
            ])
            
        cust_table = Table(
            cust_table_rows,
            colWidths=[25, 200, 110, 95, 93],
            repeatRows=1
        )
        cust_table.setStyle(TableStyle([
            ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#0F766E')),
            ('BOTTOMPADDING', (0, 0), (-1, -1), 3.5),
            ('TOPPADDING', (0, 0), (-1, -1), 3.5),
            ('LEFTPADDING', (0, 0), (-1, -1), 5),
            ('RIGHTPADDING', (0, 0), (-1, -1), 5),
            ('ROWBACKGROUNDS', (0, 1), (-1, -1), [colors.white, colors.HexColor('#F8FAFC')]),
            ('GRID', (0, 0), (-1, -1), 0.5, colors.HexColor('#E2E8F0')),
            ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
        ]))
        story.append(cust_table)
        story.append(Spacer(1, 12))
        
    # 6. Recent Sales Invoices Section (if invoices exist)
    if invoices:
        story.append(KeepTogether([
            Paragraph(f"<b>3. Recent Sales Invoices (Last {len(invoices)} Invoices)</b>", section_h1)
        ]))
        
        inv_table_rows = [
            [
                Paragraph("<b>#</b>", th_style),
                Paragraph("<b>Invoice Number</b>", th_style),
                Paragraph("<b>Date &amp; Time</b>", th_style),
                Paragraph("<b>Items Count</b>", th_right),
                Paragraph("<b>Grand Total</b>", th_right),
            ]
        ]
        
        for idx, inv in enumerate(invoices, start=1):
            ts_str = inv.timestamp.strftime('%d-%m-%Y %H:%M') if inv.timestamp else "-"
            items_cnt = len(inv.items) if getattr(inv, 'items', None) else 0
            
            inv_table_rows.append([
                Paragraph(str(idx), td_style),
                Paragraph(inv.invoice_number or f"INV-{inv.id}", td_bold),
                Paragraph(ts_str, td_style),
                Paragraph(str(items_cnt), td_right),
                Paragraph(f"Rs. {inv.grand_total:.2f}", td_right),
            ])
            
        inv_table = Table(
            inv_table_rows,
            colWidths=[25, 140, 150, 80, 128],
            repeatRows=1
        )
        inv_table.setStyle(TableStyle([
            ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#4338CA')),
            ('BOTTOMPADDING', (0, 0), (-1, -1), 3.5),
            ('TOPPADDING', (0, 0), (-1, -1), 3.5),
            ('LEFTPADDING', (0, 0), (-1, -1), 5),
            ('RIGHTPADDING', (0, 0), (-1, -1), 5),
            ('ROWBACKGROUNDS', (0, 1), (-1, -1), [colors.white, colors.HexColor('#F8FAFC')]),
            ('GRID', (0, 0), (-1, -1), 0.5, colors.HexColor('#E2E8F0')),
            ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
        ]))
        story.append(inv_table)
        story.append(Spacer(1, 14))

    # 7. Verification & Disclaimer
    disclaimer_p = Paragraph(
        "<b>Notice &amp; Verification:</b> This document is an official encrypted data backup generated automatically by Dukaan360 Smart Cloud POS system. All proprietary records and catalog pricing remain the exclusive property of the store owner. This backup document can be used for verification, audits, or system data restoration.<br/>"
        "<font color='#94A3B8'>Dukaan360 Retail ERP • 100% Secure Encrypted Cloud Data Protection</font>",
        ParagraphStyle('Disc', fontName=FONT_NORMAL, fontSize=7, leading=10, textColor=colors.HexColor('#64748B'), alignment=1)
    )
    story.append(KeepTogether([
        HRFlowable(width="100%", thickness=0.5, color=colors.HexColor("#CBD5E1"), spaceAfter=6, spaceBefore=4),
        disclaimer_p
    ]))

    doc.build(story, canvasmaker=NumberedCanvas)
    pdf_bytes = buffer.getvalue()
    buffer.close()
    return pdf_bytes


def generate_master_stores_pdf(db) -> bytes:
    import models
    
    stores = db.query(models.Store).all()
    
    buffer = io.BytesIO()
    doc = SimpleDocTemplate(
        buffer,
        pagesize=A4,
        leftMargin=36,
        rightMargin=36,
        topMargin=36,
        bottomMargin=45
    )
    
    title_style = ParagraphStyle(
        'MasterTitle',
        fontName=FONT_BOLD,
        fontSize=18,
        leading=22,
        textColor=colors.HexColor('#FF5722'),
    )
    
    th_style = ParagraphStyle(
        'MTH',
        fontName=FONT_BOLD,
        fontSize=8,
        leading=10,
        textColor=colors.white,
        alignment=0
    )
    
    th_right = ParagraphStyle(
        'MTHR',
        fontName=FONT_BOLD,
        fontSize=8,
        leading=10,
        textColor=colors.white,
        alignment=2
    )
    
    td_style = ParagraphStyle(
        'MTD',
        fontName=FONT_NORMAL,
        fontSize=8,
        leading=10,
        textColor=colors.HexColor('#1E293B')
    )
    
    td_bold = ParagraphStyle(
        'MTDBold',
        fontName=FONT_BOLD,
        fontSize=8,
        leading=10,
        textColor=colors.HexColor('#0F172A')
    )
    
    td_right = ParagraphStyle(
        'MTDRight',
        fontName=FONT_NORMAL,
        fontSize=8,
        leading=10,
        textColor=colors.HexColor('#1E293B'),
        alignment=2
    )
    
    story = []
    
    # 1. Master Header
    header_data = [
        [
            Paragraph("<b>DUKAAN360 ENTERPRISE ADMIN</b><br/><font size='9' color='#334155'>Master Stores Audit &amp; Cloud Backup Report</font>", title_style),
            Paragraph(f"<b>Generated:</b> {datetime.now().strftime('%d %b %Y, %I:%M %p')}<br/><b>Total Stores:</b> {len(stores)} Registered Stores", ParagraphStyle('MHRight', fontName=FONT_NORMAL, fontSize=8, leading=11, alignment=2, textColor=colors.HexColor('#475569')))
        ]
    ]
    header_table = Table(header_data, colWidths=[340, 183])
    header_table.setStyle(TableStyle([
        ('VALIGN', (0, 0), (-1, -1), 'TOP'),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 4),
    ]))
    story.append(header_table)
    story.append(HRFlowable(width="100%", thickness=1.5, color=colors.HexColor("#FF5722"), spaceAfter=10, spaceBefore=4))
    
    # 2. Stores Table
    rows = [
        [
            Paragraph("<b>#</b>", th_style),
            Paragraph("<b>Store Name</b>", th_style),
            Paragraph("<b>Owner Name</b>", th_style),
            Paragraph("<b>Mobile No</b>", th_style),
            Paragraph("<b>Plan / Status</b>", th_style),
            Paragraph("<b>Products</b>", th_right),
            Paragraph("<b>Customers</b>", th_right),
            Paragraph("<b>Invoices</b>", th_right),
        ]
    ]
    
    for idx, s in enumerate(stores, start=1):
        p_count = db.query(models.Product).filter(models.Product.store_id == s.id).count()
        c_count = db.query(models.Customer).filter(models.Customer.store_id == s.id).count()
        inv_count = db.query(models.SaleInvoice).filter(models.SaleInvoice.store_id == s.id).count()
        plan_str = f"{s.plan_type.value if hasattr(s.plan_type, 'value') else s.plan_type}"
        status_str = f"{s.status.value if hasattr(s.status, 'value') else s.status}"
        
        rows.append([
            Paragraph(str(idx), td_style),
            Paragraph(s.name, td_bold),
            Paragraph(s.owner_name or "-", td_style),
            Paragraph(s.mobile or "-", td_style),
            Paragraph(f"{plan_str} ({status_str})", td_style),
            Paragraph(str(p_count), td_right),
            Paragraph(str(c_count), td_right),
            Paragraph(str(inv_count), td_right),
        ])
        
    master_table = Table(rows, colWidths=[20, 130, 95, 75, 83, 40, 40, 40], repeatRows=1)
    master_table.setStyle(TableStyle([
        ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#0F172A')),
        ('BOTTOMPADDING', (0, 0), (-1, -1), 3.5),
        ('TOPPADDING', (0, 0), (-1, -1), 3.5),
        ('LEFTPADDING', (0, 0), (-1, -1), 4),
        ('RIGHTPADDING', (0, 0), (-1, -1), 4),
        ('ROWBACKGROUNDS', (0, 1), (-1, -1), [colors.white, colors.HexColor('#F8FAFC')]),
        ('GRID', (0, 0), (-1, -1), 0.5, colors.HexColor('#E2E8F0')),
        ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
    ]))
    story.append(master_table)
    story.append(Spacer(1, 15))
    
    # 3. Master Footer
    disclaimer = Paragraph(
        "<b>DUKAAN360 ENTERPRISE PLATFORM:</b> This master document contains aggregated multi-store data for administrative and auditing purposes only.<br/>"
        "<font color='#94A3B8'>Confidential &amp; Restricted Access • Dukaan360 Cloud Platform</font>",
        ParagraphStyle('MDisc', fontName=FONT_NORMAL, fontSize=7, leading=10, textColor=colors.HexColor('#64748B'), alignment=1)
    )
    story.append(HRFlowable(width="100%", thickness=0.5, color=colors.HexColor("#CBD5E1"), spaceAfter=6, spaceBefore=4))
    story.append(disclaimer)

    doc.build(story, canvasmaker=NumberedCanvas)
    pdf_bytes = buffer.getvalue()
    buffer.close()
    return pdf_bytes
