# FinTec und Zenbot Nutzung
ChatGPT 

## Was ist die FinTec, erkläre ausführlich und kann man diese mit Zenbot nutzen?

Kurzantwort

„FinTec“ kann zwei Dinge meinen: allgemein FinTech (Finanztechnologie) — der Branchenbegriff — oder die deutsche Firma FinTecSystems (heute Teil von Tink Germany).
Ob man (FinTecSystems / Tink) mit Zenbot nutzen kann? Nicht direkt out-of-the-box. Technisch sind Integrationen möglich, aber sie erfordern Entwicklungsarbeit, Klärung von Zulassung/Rechten und passende Use-Cases (siehe unten). 


---

1) Was ist „FinTec“ / „FinTech“?

FinTech (Financial Technology) ist ein Sammelbegriff für Unternehmen und Technologien, die Finanzdienstleistungen digitalisieren oder neu erfinden — z. B. Zahlungsdienste, Kreditentscheidungen, Kontoinformationen, Vermögensverwaltung, Versicherungsprozesse. FinTechs nutzen APIs, Datenanalyse, Machine Learning, Mobile-Apps etc., um Prozesse schneller, günstiger oder nutzerfreundlicher zu machen. 

FinTecSystems (FTS) war (und ist im Kern) ein deutsches B2B-FinTech aus München, spezialisiert auf Open-Banking-Infrastruktur, Kontoinformationen, Zahlungsinitiation und automatisierte Finanzdaten-Analyse; 2021 wurde FinTecSystems von Tink übernommen und firmiert inzwischen als Tink Germany. FTS betreute viele Banken/Plattformen in DACH und hatte regulatorische Zulassungen (BaFin-Kontext für FinTechs ist ebenfalls relevant). 


---

2) Was macht FinTecSystems / Tink technisch?

Kurz: Bank-Konnektivität + Smart Data

Stellt APIs/Connectoren zu Tausenden Banken bereit (z. B. PSD2/Screen-scraping-Alternativen, Account-Information, Payment Initiation).

Bietet Analytik (z. B. Einkommens-/Ausgabenerkennung, Scoring, Plausibilitätsprüfungen) für KYC, Kreditentscheidungen, Bonitätsprüfungen oder Account-Verifizierung.

Lieferte seinen Service an Vergleichsportale, Banken, Kreditplattformen und FinTechs. 



---

3) Was ist Zenbot?

Zenbot ist ein Open-Source-Krypto-Trading-Bot (Node.js), der über Exchange-APIs handelt (z. B. Binance, Kraken, Coinbase Pro etc.), Backtesting ermöglicht und automatisierte Handelsstrategien ausführt. Die Architektur basiert auf Anbindungen an Börsen-APIs, nicht an klassischen Bank-Konto-Aggregatoren. 


---

4) Kann man FinTecSystems / Tink mit Zenbot nutzen? (konkrete Möglichkeiten & Einschränkungen)

Kurz: Ja — aber nicht „plug & play“.

Zenbot handelt auf Krypto-Börsen über deren API-Schlüssel. FinTecSystems/Tink liefert Bank-/Kontodaten und Zahlungsinitiativen — unterschiedliche Domänen. Eine direkte native Integration (ein Knopf in Zenbot: „use FinTec“) existiert nicht. 

Mögliche Integrationsszenarien

1. Kontostand / Cash-Management für Risiko-Limits

Verwende Tink/FinTec-APIs, um dein Bankkonto-Guthaben und eingehende/ausgehende Zahlungen zu überwachen. Diese Daten können Zenbot-Parameter setzen (z. B. maximale Positionsgröße, Safety-cutoff).

Technisch: ein kleines Middleware-Service liest Tink-API → berechnet verfügbare EUR/BTC-Budget → schreibt es in Zenbot-Konfig oder ruft Zenbot-REST/CLI auf. 



2. On/Off-ramp / Zahlungsinitiation

Payment-Initiation (PIS) könnte automatische Fiat-Einzahlungen/Abhebungen zu/von einer Börse anstoßen — in der Praxis aber: Börsen akzeptieren meist SEPA/Banküberweisung oder eigene Zahlungsrouten; das ist regulatorisch und operational komplex. Du bräuchtest PIS-Flows, Zustimmung des Nutzers, Prüfungen und oft manuelle Schritte bei der Börse. 



3. Nutzersignale / Portfolio-Decisions

Analysen aus Bankdaten (z. B. Gehaltseingänge, Sparraten) können Trading-Strategien beeinflussen (konservativer bei wenig Cash, aggressiver bei regelmäßigem Einkommen). Das ist eher ein Data-Science/Strategie-Layer, nicht ein direkter Bot-Connector.




Technische Voraussetzungen / Aufgaben

API-Key / Zugang zu Tink/FinTec (B2B; Registrierung, Vertrag, ggf. Sandbox). 

Entwicklung einer Middleware (Node.js/Python) zum Übersetzen der Tink-Daten in Zenbot-Inputs (Zenbot ist Node.js-basiert, also gut kombinierbar). 

Sicherheits- und Compliance-Checks: Speicherung von Bankdaten, Nutzerzustimmung (DSGVO), Zahlungsrechte, BaFin-/Zulassungsfragen, je nach Geschäftsmodell. 


Praktische Einschränkungen / Risiken

Zenbot zielt auf Krypto-Exchanges — Einzahlungen/Auszahlungen über Banken dauern; arbitrage- oder high-frequency-Strategien profitieren kaum von Bank-Daten.

Regulatorik & Haftung: Automatische Geldbewegungen über Bank-APIs/PIS erfordern Sorgfalt, klare Autorisierungen und evtl. Lizenzen.

Stabilität & Support: Zenbot ist Open-Source und von Community gepflegt; produktiver Einsatz mit realem Geld erfordert sorgfältiges Testing. 



---

5) Konkrete Empfehlungen (wenn du das integrieren willst)

1. Use-Case definieren: Willst du nur Informations-Signale (Kontostand → Risiko), oder automatische Zahlungen? Informations-Use-cases sind viel einfacher.


2. Sandbox testen: Tink/FinTec und viele Banken haben Sandbox-APIs; setze eine Middleware auf, die periodisch Kontodaten holt und in ein Test-Zenbot einspeist. 


3. Sicherheit & Zustimmung: Implementiere OAuth/PSU-Flows korrekt, sichere Keys, DSGVO-Dokumentation.


4. Backtesting: Simuliere Entscheidungen (Bankdaten → Trade) lange genug, bevor du echtes Kapital benutzt.


5. Rechtliches prüfen: Falls du für Dritte handelst oder automatisierte Zahlungsinitiationen anbietest, prüfe BaFin-Erfordernisse. 




---

6) Fazit (knapp)

„FinTec“ meist = FinTech (Branche) oder konkret FinTecSystems (heute Teil von Tink) — Anbieter von Open-Banking-APIs und Finanzdatenanalyse. 

Zenbot ist ein Krypto-Exchange-Trading-Bot (API-basiert). Direkte, fertige Integration gibt es nicht. Mit Entwicklungsaufwand kannst du Bankdaten/Payment-APIs von Tink/FinTec zur Steuerung oder Absicherung von Zenbot nutzen — automatische Zahlungen sind aber regulatorisch und technisch anspruchsvoll. 



---

Wenn du möchtest, erstelle ich dir direkt (1) ein technisches Integrations-Flussdiagramm (Middleware-API-Design) oder (2) ein konkretes Node.js-Beispiel (Skizze), wie man Tink-API-Daten in Zenbot-Konfig liest — schreibe mir kurz, welche Option du bevorzugst; ich liefere den Code/Plan sofort. 



## Openbanking mit Zenbot

Hier ist eine klare, praxisorientierte Erklärung, wie man Open Banking grundsätzlich mit Zenbot kombinieren kann – was geht, was nicht, und wie eine realistische Architektur aussieht.


---

✅ Open Banking mit Zenbot – geht das?

Ja – aber nicht direkt.
Zenbot unterstützt keine Open-Banking-APIs (z. B. Tink, FinTecSystems, Yapily, Nordigen/GoCardless) nativ.
Zenbot kann ausschließlich mit Krypto-Börsen über deren API (REST/WebSocket) handeln.

👉 Open Banking kann aber über eine eigene Middleware angebunden werden, die Bankdaten liest und daraus Zenbot steuert.


---

🔧 Was du mit Open Banking & Zenbot machen kannst

1. Bankdaten → Risiko- und Budget-Steuerung

Du kannst Open-Banking-Daten nutzen, um Zenbot automatisch so einzustellen, dass:

nur so viel Kapital gehandelt wird, wie wirklich auf dem Bankkonto verfügbar ist

Handelslimits sich automatisch anpassen (z. B. basierend auf Einkommenseingängen)

Zenbot pausiert, wenn zu wenig Liquidität vorhanden ist


👉 Open Banking liefert Daten, Zenbot handelt weiterhin nur an Exchanges.


---

2. Automatische SEPA-Einzahlungen / Auszahlungen (theoretisch)

Mit PIS (Payment Initiation Services) könntest du automatisierte Überweisungen auslösen, z. B.:

„Wenn Kontostand > 2000€, überweise 200€ zur Börse“

„Wenn Bot-Profite > X, sende Fiat an Bankkonto zurück“


⚠️ Achtung: In der Praxis schwierig

Börsen akzeptieren zwar SEPA, aber Einzahlungen sind nicht API-gesteuert.

Viele Exchanges verlangen Referenzcodes, manuelle Freigaben usw.

Rechtlich musst du Nutzerzustimmung exakt managen (PSD2).


👉 Es ist möglich, aber es ist kein Plug-and-Play und braucht saubere Compliance.


---

3. Bankdaten als Teil der Trading-Strategie

Du kannst Muster im Bankkonto nutzen, etwa:

regelmäßige Gehaltseingänge

Ausgabeverhalten

Sparquoten


Diese Daten können in der Strategielogik genutzt werden, um z. B.:

aggressiv zu handeln, wenn Liquidität hoch ist

konservativ zu handeln, wenn wenig Cash da ist

Handel zu pausieren, wenn Ausgaben ungewöhnlich hoch sind



---

❌ Was du NICHT direkt tun kannst

Zenbot kann nicht direkt „von der Bank kaufen/verkaufen“

Zenbot kann keine Bankkonten anbinden

Zenbot kann keine SEPA-Zahlungen ausführen

Open Banking ersetzt keine Exchange-API



---

🏗️ Wie sieht eine realistische Integration aus? – Architektur

[ Open Banking API (z. B. Tink, FinTecSystems, Yapily) ]
                        ↓
        [ Deine Middleware / Node.js-Service ]
                        ↓
       - berechnet Budget
       - legt Risiko-Limits fest
       - triggert Ein-/Auszahlungen (falls erlaubt)
                        ↓
           [ Zenbot Einstellungen / CLI ]
                        ↓
             [ Zenbot Trading Engine ]
                        ↓
     [ Krypto-Börse: Binance, Kraken, Coinbase … ]


---

📌 Beispiel: Steuerung von Zenbot via Open Banking

1. Bankdaten abfragen (Node.js)

(Beispiel pseudocode, nicht API-spezifisch)

const bankBalance = await openBankingApi.getBalance();

if (bankBalance.available < 1000) {
    // Not enough money → reduce risk
    updateZenbotConfig({ max_buy_amount: 10 });
} else {
    updateZenbotConfig({ max_buy_amount: 100 });
}

2. Zenbot-Konfig aktualisieren

(vereinfachtes Beispiel)

zenbot configure --max_buy_size=100

Oder automatisiert per Node.js:

const { exec } = require("child_process");

exec("zenbot sim config_strategy.json", () => {
    console.log("Zenbot config updated");
});


---

🧠 Realitätscheck – Lohnt sich Open Banking + Zenbot?

Sinnvoll für:

✔ Portfolio-Management
✔ Risiko-Management
✔ Kapital-Dynamisierung
✔ Automatisierte Parameter-Anpassungen
✔ Benutzer-gebundenes Trading

Weniger sinnvoll für:

✘ High-Frequency-Trading
✘ Arbitrage
✘ Echtzeit-Rebalancing
(weil Bankdaten relativ „langsam“ sind)


---

💬 Wenn du willst …

Kann ich dir zusätzlich liefern:

🔹 Architekturdiagramm (grafisch)
🔹 Fertigen Node.js-Code für eine Middleware
🔹 Beispiel-Konfiguration für Zenbot
🔹 Vollständiges Open-Banking-Integrationsprojekt (Template)

Sag einfach, welche Variante du brauchst!

## Mit Binance kann man auch Auszahlungen auf andere Wallets vornehmen, die nicht von Binance bereit gestellt wurden. Können diese Auszahlungen auch mit Zenbot realisiert werden?

Kurzantwort: Nein – Zenbot kann von Haus aus keine Binance-Auszahlungen (Withdrawals) auf externe Wallets durchführen.
Aber: Es ist technisch möglich, wenn du selbst Code schreibst – allerdings mit erheblichen Risiken und Einschränkungen.

Ich erkläre dir im Detail warum:


---

✅ 1. Offizieller Status: Zenbot unterstützt KEINE Crypto-Withdrawals

Zenbot kann:

Preise abrufen

Orders (Kauf/Verkauf) ausführen

Backtesting

Strategien laufen lassen


Zenbot kann nicht:

Auszahlungen (Withdraw, Transfer)

Einzahlungen

Interne oder externe Wallet-Transfers


👉 Die offiziellen Zenbot-Exchange-Adapter beinhalten ausschließlich Trading-Funktionen, keine „funding“-Funktionen.


---

✅ 2. Kann man Binances Withdrawal-API trotzdem nutzen?

Ja, technisch möglich, aber nur durch eigene Programmierung, z. B.:

Erweiterung des Binance-Adapters in /extensions/exchanges

Oder eine separate Middleware, die Binance-Withdraw-API nutzt


Beispiel (gekürzt), Binance-API für Withdraw:

POST /sapi/v1/capital/withdraw/apply

Parameter wie:

coin

amount

address

network

walletType


👉 Zenbot selbst ruft diesen Endpunkt nicht auf — das müsstest du programmieren.


---

⚠️ 3. Große Risiken (wirklich ernst nehmen!)

Withdrawals sind sicherheitskritisch:

🔥 RISK 1 — API-Key muss „Withdraw enabled“ haben

Das ist extrem gefährlich.
Wenn Zenbot, ein Bug oder ein Angreifer Zugriff bekommt → sofortige unwiderrufliche Auszahlung aller Coins möglich.

🔥 RISK 2 — Zenbot ist nicht für Funding/Transfers gebaut

Zenbot ist ein Trading-Bot.
Wenn du Withdrawal-Funktionen einbaust, musst du selbst sicherstellen:

Limits

Whitelist-Adressen

2FA/Anti-Phishing

Retry-Logik

Logging

Sicherheitschecks


🔥 RISK 3 — Withdrawal-APIs sind nicht für Bot-Hochfrequenz vorgesehen

Ein einzelner falsch gesetzter API-Call kann dauerhaft Kapital verlieren.


---

🟨 4. Der einzige sichere Weg (empfohlen)

Wenn du so etwas wirklich willst:

✔ Ein eigenes Microservice bauen

Zenbot tradet wie immer

Ein separates Node.js-Go-Python-Service überwacht Gewinne/Verluste

Dieses Service entscheidet manuell, ob ein Withdrawal stattfindet

Es nutzt Binance-API, aber mit:
✔ Whitelisted Addresses
✔ festen Limits
✔ menschlicher Bestätigung


✔ KEINE Zenbot-internen Withdrawals!

Damit bleibt Zenbot ein Trading-Bot und dein Geld ist deutlich sicherer.


---

🟦 5. Ist eine vollständige automatische Auszahlungsstrategie möglich?

Ja, aber nur mit:

einem separaten Secure-Service

einer Whitelist

Limits

Signierung über API-Key mit Withdrawal-Privilegien

robustem Monitoring


Ich würde das niemandem empfehlen, der nicht fortgeschrittener Entwickler mit Sicherheitskenntnissen ist.


---

🧠 Fazit

Frage	Antwort

Kann Zenbot Binance-Auszahlungen ausführen?	❌ Nicht eingebaut
Kann man es selbst programmieren?	✔ Ja, mit Binance-Withdraw-API
Ist es sicher?	⚠️ Nur mit extrem vorsichtigen Sicherheitsmaßnahmen
Empfohlene Methode?	✔ Separater Microservice, nicht direkt im Zenbot-Kern



---

Wenn du möchtest …

Kann ich dir erstellen:

🔹 A) Beispiel-Code für ein sicheres Withdrawal-Microservice (Node.js)

🔹 B) Erweiterung des Zenbot-Adapters (mit Warnhinweisen)

🔹 C) Komplettes Sicherheitskonzept (API-Key-Management, Limits, Architecture Diagram)

Sag mir einfach, welche Variante du möchtest!



# Gibt es seriöse Dienste, die Einzahlungen von Fiat Währungen z.B. in Euro, USD oder RUB per API-Anbindung an ein Crypto Wallet auf z.B. BTC ermöglichen.

Ja — es gibt seriöse Dienste („On-Ramp“ bzw. „Fiat → Krypto / Wallet“) mit API-Anbindung, die genau das ermöglichen, was du suchst: Einzahlung von Fiat (z. B. Euro, USD) und automatisches Konvertieren/Senden in eine Krypto-Wallet (z. B. BTC, ETH, stabile Coins). Hier sind ein paar bekannte und (relativ) seriöse Anbieter — mit Vor- und Nachteilen, was funktioniert und worauf man achten muss:

✅ Seriöse Dienste für “Fiat → Crypto (Wallet) via API”

Anbieter / Dienst	Was sie bieten / Vorteile

Coinbase (Onramp API / SDK)	Die „Onramp“-API von Coinbase erlaubt, per API Fiat-Zahlungen (Bank, Karte, etc.) in Krypto umzuwandeln — und direkt auf On-Chain-Wallets zu transferieren. Unterstützt viele Fiat-Währungen und breite Auswahl an Krypto Assets. 
MoonPay	Bekannter Crypto-On-Ramp: Ermöglicht Kauf von Kryptowährungen mit Fiat (Kreditkarte, Banküberweisung etc.) und Überweisung in Wallets. MoonPay wird oftmals von Wallet-Anbietern eingebunden. 
B2BINPAY	B2BINPAY bietet eine On-Ramp-Lösung, die Fiat/Geldtransfers entgegennimmt (Bank, Karte, lokale Methoden), konvertiert und direkt eine hinterlegte digitale Wallet gut-schreibt — geeignet für Dienste und Plattformen. 
Diverser “White-label / API-Gateway” Anbieter (je nach Dienstleister)	Manche Anbieter richten sich eher an Unternehmen/Plattformen (z. B. Zahlungsdienstleister, Broker), bieten Zahlung, KYC/AML, Wallet-Credit etc. als Komplettpaket ohne eigenes Exchange-Backend.



---

⚠️ Wichtige Einschränkungen & worauf du achten musst

KYC / Compliance: Seriöse On-Ramp-Services verlangen i. d. R. Identitätsprüfung (Know-Your-Customer), insbesondere wenn Fiat-Einzahlung + Crypto Transfer automatisiert werden.

Gebühren & Wechselkurse: Kauf mit Fiat (Kreditkarte, Banküberweisung) über On-Ramp-Dienste kann teurer sein als klassischer Börsen-Deposit.

Verfügbarkeit nach Region: Nicht alle Dienste unterstützen jede Region/ jedes Land / jede Fiat-Währung — vorher prüfen.

Automatisierung + Sicherheit: Wenn du per API einsetzt — Wallet-Adresse, Transaktionen etc. müssen sicher gemanagt werden (z. B. durch eigene Backend-Logik, Whitelists, Limits).

Nicht alle Dienste sind gleich flexibel: Manche bieten nur Kauf + Wallet-Credit, andere zusätzlich Swap, Stablecoin-Optionen etc. Je nach Use-Case.



---

🎯 Für wen sind solche Dienste geeignet — und wann lieber nicht

Gut geeignet für

Apps, Plattformen oder Services, die Nutzern einen einfachen Weg bieten wollen, mit Fiat einzusteigen und direkt Krypto in einer Wallet zu erhalten.

Automatisierte Prozesse: z. B. Onboarding, Zahlungs- oder Spar-Dienste, Backend-gestützte Käufe.

Projekte mit KYC/Compliance und gutem Sicherheitsparadigma.


Weniger geeignet / Vorsicht bei

Wenn du maximale Privatsphäre willst (KYC, Identitätsprüfung, Regulierung).

Für kleine, einmalige Käufe — Gebühren & Aufwand passen oft besser für größere oder wiederkehrende Nutzung.

Wenn du keine sichere Infrastruktur (z. B. eigene Server, sichere Speicherung von Adressen/Schlüsseln) hast.



---

💡 Meine Einschätzung (als Empfehlung)

Wenn du ernsthaft planst, Fiat-Einzahlungen per API → Crypto-Wallet zu ermöglichen (z. B. für automatisierte Projekte, Trading-Bots, Spar-Apps …), sind Dienste wie Coinbase Onramp, MoonPay oder B2BINPAY gute Ausgangspunkte — sie sind etabliert, relativ transparent und supporten APIs.

Wichtig: Automatisierung sollte mit Vorsicht erfolgen — sichere Architektur, Compliance & Risiko-Management sind Pflicht.


---

Wenn du willst — kann ich eine Liste von 5–10 aktuellen API-Anbietern herleiten, die für EU + Euro geeignet sind (also mit SEPA oder Kreditkarte funktionierend). Dann siehst du, was realistisch ist, wenn du aus Deutschland agierst. Möchtest du so eine Liste?

## Ja

Hier ist eine aktuelle Auswahl von 5–10 seriösen API-Anbietern / On-Ramp-Services, die sich gut eignen, wenn du aus Europa (z. B. mit Euro / SEPA) einsteigen willst — also Fiat → Krypto/Wal­let via API. Ich konzentriere mich auf Dienste, die möglichst regulatorisch aufgestellt sind und API- bzw. Developer-Anbindung bieten.

✅ Empfehlenswerte Fiat-→-Crypto On-Ramp & API Anbieter

Anbieter	Kurzbeschreibung / Stärken

Coinbase Onramp	Offizielle On-Ramp-/Off-Ramp-API von Coinbase: Fiat-Einzahlungen (z. B. per Karte oder Bank) → Krypto + Wallet-Credit. Sandbox-Umgebung verfügbar, Entwicklerfreundlich. 
MoonPay	Globaler Anbieter mit Kreditkarte, Bank-Überweisung (je nach Region), unterstützt viele Kryptowährungen und viele Länder. Besonders beliebt bei Projekten und Wallet-Integrationen. 
B2BINPAY	„On-Ramp Gateway“ mit API: akzeptiert unterschiedliche Fiat-Zahlarten, konvertiert zu Crypto und schreibt digital Wallets gut — geeignet für Plattformen, Händler, Broker. 
Transak	Bekannt als EU-freundlicher On-Ramp-/Off-Ramp-Dienst mit guter Entwicklerintegration und Multi-Fiat-Support; eignet sich besonders wenn man APIs in eigene App/Service einbinden will. 
Ramp Network	Global aktiver On-/Off-Ramp Dienst: unterstützt viele Fiat-Währungen und Krypto-Assets; API-/Embed-Support, geeignet für Wallets oder Web3-Apps. 
Bitpanda	EU-basierter, regulierter Anbieter mit guter SEPA/EU-Banking-Anbindung — praktisch, wenn du aus dem Euro-Raum kommst und regulatorische Konformität wichtig ist. 



---

⚠️ Hinweise & worauf du bei der Wahl achten solltest

Viele dieser Anbieter verlangen eine KYC/Identitätsprüfung, bevor der Fiat-to-Crypto-Flow funktioniert — das ist normal und Teil der Compliance.

Verfügbarkeit kann je nach Land / Region variieren — also vor Integration prüfen, ob von deinem Standort aus die Fiat-Rails (SEPA, Karte etc.) unterstützt sind.

Gebühren und Wechselkurse unterscheiden sich deutlich — z. B. direkte Kartenkäufe sind oft teurer als Bank/SEPA.

Wenn du automatisieren willst (z. B. per Bot oder als Service), muss die API-Integration sorgfältig und sicher erfolgen (Adressen-Whitelists, Fehlerbehandlung, Logging etc.).



---

🎯 Meine Einschätzung

Für ein Projekt mit EU-Fokus und Wallet-Integration sind Coinbase Onramp, MoonPay, Transak oder B2BINPAY wahrscheinlich die flexibelsten Optionen.

Wenn dir Regulierung, EU-Banking und Compliance wichtig sind, ist Bitpanda eine gute Wahl.

Für möglichst globale Reichweite (auch potenziell USD oder andere Währungen) könnten Ramp Network oder MoonPay interessant sein.



---

Wenn du willst — ich kann für jeden dieser Anbieter schauen, ob API-Dokumentation öffentlich einsehbar ist — und jeweils den direkten Link zur Developer-Dokumentation heraussuchen (damit du sofort loslegen kannst). Möchtest du das so? 
