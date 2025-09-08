import sys
import json
import pdfplumber
import re

# ---------- helpers ----------------------------------------------------------
def clean(cell):
    """Return stripped string or empty string for None."""
    return str(cell).strip() if cell is not None else ""

def safe_cell(row, idx, default=""):
    """Return cleaned cell at idx or default if idx out of range."""
    return clean(row[idx]) if idx < len(row) else default

def pad_row(row, target_len):
    """Return a list that is always target_len long."""
    return [safe_cell(row, i) for i in range(target_len)]

def is_money(value):
    value = str(value).replace(',', '').replace('₱', '').replace('$', '').strip()
    return re.fullmatch(r'\d+(\.\d{1,2})?', value) is not None

def is_small_int(value):
    value = str(value).replace(',', '').strip()
    return value.isdigit() and int(value) <= 1000

# ---------- main -------------------------------------------------------------
def parse_pdf(path, mode):
    rows = []

    # how many physical columns we want to work with
    expected_columns = 10

    with pdfplumber.open(path) as pdf:
        for page in pdf.pages:
            strategies = [
                {"vertical_strategy": "lines", "horizontal_strategy": "lines"},
                {"vertical_strategy": "lines_strict", "horizontal_strategy": "lines_strict"},
                {"vertical_strategy": "text", "horizontal_strategy": "text"},
            ]

            for strategy in strategies:
                try:
                    tables = page.extract_tables(table_settings=strategy)
                    if not tables:
                        continue

                    for table in tables:
                        if len(table) < 2:          # need at least header + 1 data row
                            continue

                        for raw_row in table[1:]:   # skip header
                            if not raw_row or len([c for c in raw_row if c]) < 3:
                                continue

                            first = clean(raw_row[0]).lower()
                            if first in {"quantity", "value", "total", "grand total"}:
                                continue
                            if all(is_money(clean(c)) or is_small_int(clean(c))
                                   for c in raw_row if c) and not first.isalpha():
                                continue

                            # ---- guarantee correct length -----------------
                            cells = pad_row(raw_row, expected_columns)

                            # ---- RPCSP-specific merge fix ---------------
                            if mode.upper() == "RPCSP" and len(cells) == expected_columns:
                                # if col-4 still holds “unit_value/quantity_card” glued together
                                merged = cells[4]
                                parts = re.findall(r'\d+(?:\.\d+)?', merged)
                                if len(parts) == 2:
                                    cells[4] = parts[0]          # unit_value
                                    cells.insert(5, parts[1])    # quantity_card
                                    # re-pad in case we grew the list
                                    cells = pad_row(cells, expected_columns)

                            # ---- build final dict -----------------------
                            if mode.upper() == "RPCSP":
                                data = {
                                    "article": cells[0],
                                    "description": cells[1],
                                    "semi_expendable_property_no": cells[2],
                                    "unit_of_measure": cells[3],
                                    "unit_value": cells[4],
                                    "quantity_per_property_card": cells[5],
                                    "quantity_per_physical_count": cells[6],
                                    "shortage_overage": {
                                        "quantity": cells[7],
                                        "value": cells[8]
                                    },
                                    "remarks_whereabouts": cells[9]
                                }
                            else:  # PPE
                                data = {
                                    "article": cells[0],
                                    "description": cells[1],
                                    "property_number_RO": cells[2],
                                    "property_number_CO": cells[3],
                                    "unit_of_measure": cells[4],
                                    "unit_value": cells[5],
                                    "quantity_per_property_card": cells[6],
                                    "quantity_per_physical_count": cells[7],
                                    "shortage_overage": {
                                        "quantity": cells[8],
                                        "value": cells[9]
                                    },
                                    "remarks_whereabouts": cells[9]  # last col reused
                                }

                            if data.get("article") or data.get("description"):
                                rows.append(data)

                    break  # first strategy that gave tables wins
                except Exception:
                    continue
    return rows

# ---------- CLI entry ---------------------------------------------------------
if __name__ == "__main__":
    if len(sys.argv) != 3:
        print("usage: python parser.py <file.pdf> <RPCSP|PPE>")
        sys.exit(1)

    file_path, mode = sys.argv[1], sys.argv[2].strip().upper()
    parsed = parse_pdf(file_path, mode)
    sys.stdout.write(json.dumps(parsed, ensure_ascii=False, indent=None))
    sys.stdout.flush()