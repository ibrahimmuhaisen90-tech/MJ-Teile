# MJ-ATP auf iPhone und iPad

In Safari die GitHub-Pages-Adresse mit `/mj-atp/` am Ende öffnen. Nach „Für Offline-Nutzung bereit“ über Teilen → Zum Home-Bildschirm hinzufügen. Falls angeboten, „Als Web-App öffnen“ aktivieren.

Die App enthält 99 Artikelplätze, HTML-Vorschau und -Export, Modelle, Motoren, Schnelleingabe und den lokalen Artikel-Assistenten. Keine KI-Anbindung oder API-Gebühren.

Artikel bleiben auf dem jeweiligen Gerät. Eine automatische Synchronisierung gibt es nicht. Über „Alle Artikel als Datei sichern“ eine JSON-Sicherung erstellen; auf einem anderen Gerät über „Mehrere Artikel aus einer Datei laden“ importieren. Der Import ersetzt die Artikelplätze. Safari kann beim Installieren einen eigenen Speicherbereich verwenden: die Sammlung bei Bedarf erneut importieren. Gelöschte Browser-/App-Daten können nur aus einer Sicherung wiederhergestellt werden.

Offline funktioniert nach dem ersten erfolgreichen Laden. Die Vorschau hat eingebettete Schrift- und Bilddateien; der exportierte eBay-HTML-Code behält die ursprünglichen Verweise. Ein verfügbares App-Update wird angeboten und erst auf Knopfdruck aktiviert. Artikeldaten werden nicht in GitHub gespeichert.

Diese Dateien können unverändert in einem GitHub-Pages-Unterordner liegen. Relative Pfade halten Manifest, Symbole und Service Worker innerhalb dieses Ordners. HTTPS ist für die Installation und Offline-Nutzung erforderlich (lokale Entwicklung: localhost).

Apple: https://support.apple.com/guide/iphone/open-as-web-app-iphea86e5236/ios
GitHub Pages: https://docs.github.com/en/pages/getting-started-with-github-pages/configuring-a-publishing-source-for-your-github-pages-site
