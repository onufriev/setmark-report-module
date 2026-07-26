# Источники

Сюда помещаются исходные файлы и локальные снимки внешних страниц.

- `source-manifest.json` - реестр источников;
- `snapshots/` - сохранённое содержимое Confluence, Notion, Jira, документов и других источников.

Ссылка без снимка не может служить доказательством требования.

Регистрация снимка:

```bash
python tools/register_source_snapshot.py --source-id SRC-001 --name "Название" --type CONFLUENCE --origin "https://..." --snapshot sources/snapshots/SRC-001.md
```

Регистрация выдержки:

```bash
python tools/register_source_evidence.py --source-id SRC-001 --domain-id productContext --snapshot sources/snapshots/SRC-001.md --location "Раздел 2" --excerpt "Точный текст из снимка"
```
