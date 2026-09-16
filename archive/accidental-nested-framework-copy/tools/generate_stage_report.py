#!/usr/bin/env python3
"""Generate a PDF from a Product Compiler stage report on Windows, macOS or Linux."""
from __future__ import annotations

import argparse
import html
import os
import re
import sys
from pathlib import Path

from common import PHASE_SEQUENCE, project_path


def find_fonts() -> tuple[str | None, str | None]:
    explicit_regular = os.environ.get('PC_FONT_REGULAR')
    explicit_bold = os.environ.get('PC_FONT_BOLD')
    if explicit_regular and Path(explicit_regular).is_file():
        bold = explicit_bold if explicit_bold and Path(explicit_bold).is_file() else explicit_regular
        return explicit_regular, bold
    pairs = [
        (Path('C:/Windows/Fonts/arial.ttf'), Path('C:/Windows/Fonts/arialbd.ttf')),
        (Path('C:/Windows/Fonts/segoeui.ttf'), Path('C:/Windows/Fonts/segoeuib.ttf')),
        (Path('/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf'), Path('/usr/share/fonts/truetype/dejavu/DejaVuSans-Bold.ttf')),
        (Path('/usr/share/fonts/truetype/liberation2/LiberationSans-Regular.ttf'), Path('/usr/share/fonts/truetype/liberation2/LiberationSans-Bold.ttf')),
        (Path('/System/Library/Fonts/Supplemental/Arial.ttf'), Path('/System/Library/Fonts/Supplemental/Arial Bold.ttf')),
        (Path('/Library/Fonts/Arial.ttf'), Path('/Library/Fonts/Arial Bold.ttf')),
    ]
    for regular, bold in pairs:
        if regular.is_file():
            return str(regular), str(bold if bold.is_file() else regular)
    return None, None


def inline(text: str) -> str:
    text = html.escape(text, quote=False)
    text = re.sub(r'`([^`]+)`', r'\1', text)
    text = re.sub(r'\*\*([^*]+)\*\*', r'<b>\1</b>', text)
    text = re.sub(r'\*([^*]+)\*', r'<i>\1</i>', text)
    return text.strip()


def main() -> int:
    parser = argparse.ArgumentParser(description='Создать PDF из контрольного отчёта этапа')
    parser.add_argument('--phase', required=True, choices=PHASE_SEQUENCE)
    parser.add_argument('--markdown', required=True, help='Markdown-файл внутри reports/')
    parser.add_argument('--pdf', required=True, help='PDF-файл внутри reports/')
    args = parser.parse_args()
    markdown = project_path(args.markdown, must_exist=True, allowed_root='reports')
    pdf = project_path(args.pdf, allowed_root='reports')
    if markdown.suffix.lower() != '.md' or pdf.suffix.lower() != '.pdf':
        raise SystemExit('Ожидаются файлы .md и .pdf внутри reports/')

    try:
        from reportlab.lib import colors
        from reportlab.lib.pagesizes import A4
        from reportlab.lib.styles import ParagraphStyle, getSampleStyleSheet
        from reportlab.lib.units import mm
        from reportlab.pdfbase import pdfmetrics
        from reportlab.pdfbase.ttfonts import TTFont
        from reportlab.platypus import Paragraph, SimpleDocTemplate, Spacer, Table, TableStyle
    except ImportError:
        print('Не установлен reportlab. Выполните: python -m pip install -r requirements-tooling.txt', file=sys.stderr)
        return 2

    regular, bold = find_fonts()
    if not regular:
        print(
            'Не найден системный шрифт с кириллицей. Укажите PC_FONT_REGULAR и PC_FONT_BOLD.',
            file=sys.stderr,
        )
        return 2
    pdfmetrics.registerFont(TTFont('PCRegular', regular))
    pdfmetrics.registerFont(TTFont('PCBold', bold))
    getSampleStyleSheet()
    title = ParagraphStyle('Title', fontName='PCBold', fontSize=21, leading=25, textColor=colors.HexColor('#17324D'), spaceAfter=11)
    meta = ParagraphStyle('Meta', fontName='PCRegular', fontSize=9.2, leading=12, textColor=colors.HexColor('#5B6876'), spaceAfter=2)
    h1 = ParagraphStyle('H1', fontName='PCBold', fontSize=14.5, leading=18, textColor=colors.HexColor('#1F4E79'), spaceBefore=10, spaceAfter=6)
    body = ParagraphStyle('Body', fontName='PCRegular', fontSize=10.3, leading=14.7, textColor=colors.HexColor('#25313C'), spaceAfter=5)
    bullet = ParagraphStyle('Bullet', parent=body, leftIndent=12, firstLineIndent=-7, spaceAfter=3)
    decision = ParagraphStyle('Decision', parent=body, backColor=colors.HexColor('#EEF5FA'), borderColor=colors.HexColor('#9BB9D1'), borderWidth=.6, borderPadding=8, spaceBefore=8, spaceAfter=8)

    lines = markdown.read_text(encoding='utf-8-sig').splitlines()
    story = []
    index = 0
    while index < len(lines):
        line = lines[index].rstrip()
        if not line:
            story.append(Spacer(1, 2.5 * mm)); index += 1; continue
        if line.startswith('# '):
            story.append(Paragraph(inline(line[2:]), title)); index += 1; continue
        if line.startswith('## '):
            story.append(Paragraph(inline(line[3:]), h1)); index += 1; continue
        if line.startswith('**') and line.endswith('  '):
            story.append(Paragraph(inline(line), meta)); index += 1; continue
        if line.startswith('- '):
            story.append(Paragraph('• ' + inline(line[2:]), bullet)); index += 1; continue
        if line.startswith('|'):
            rows = []
            while index < len(lines) and lines[index].strip().startswith('|'):
                values = [inline(value.strip()) for value in lines[index].strip().strip('|').split('|')]
                if not all(re.fullmatch(r'-+:?', value.replace(' ', '')) for value in values):
                    rows.append(values)
                index += 1
            if rows:
                widths = [(170 * mm) / len(rows[0])] * len(rows[0])
                data = [[Paragraph(value, body) for value in row] for row in rows]
                table = Table(data, colWidths=widths, repeatRows=1, hAlign='LEFT')
                table.setStyle(TableStyle([
                    ('FONTNAME', (0, 0), (-1, -1), 'PCRegular'),
                    ('BACKGROUND', (0, 0), (-1, 0), colors.HexColor('#E8F0F6')),
                    ('TEXTCOLOR', (0, 0), (-1, 0), colors.HexColor('#17324D')),
                    ('GRID', (0, 0), (-1, -1), .35, colors.HexColor('#C9D4DD')),
                    ('VALIGN', (0, 0), (-1, -1), 'MIDDLE'),
                    ('LEFTPADDING', (0, 0), (-1, -1), 6),
                    ('RIGHTPADDING', (0, 0), (-1, -1), 6),
                    ('TOPPADDING', (0, 0), (-1, -1), 5),
                    ('BOTTOMPADDING', (0, 0), (-1, -1), 5),
                ]))
                story.extend([table, Spacer(1, 3 * mm)])
            continue
        style = decision if ('Продолжить:' in line or 'Внести правки:' in line) else body
        story.append(Paragraph(inline(line), style)); index += 1

    pdf.parent.mkdir(parents=True, exist_ok=True)

    def footer(canvas, doc):
        canvas.saveState()
        canvas.setFont('PCRegular', 8)
        canvas.setFillColor(colors.HexColor('#7B8794'))
        canvas.drawString(18 * mm, 10 * mm, args.phase)
        canvas.drawRightString(A4[0] - 18 * mm, 10 * mm, str(doc.page))
        canvas.restoreState()

    document = SimpleDocTemplate(
        str(pdf), pagesize=A4, leftMargin=20 * mm, rightMargin=20 * mm,
        topMargin=17 * mm, bottomMargin=17 * mm, title=markdown.stem,
    )
    document.build(story, onFirstPage=footer, onLaterPages=footer)
    print(f'PDF создан: {pdf}')
    return 0


if __name__ == '__main__':
    raise SystemExit(main())
