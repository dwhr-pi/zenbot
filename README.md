![zenbot logo](assets/logo.png)

> Um dem Pfad zu folgen: “Schauen Sie zum Meister, folgen Sie dem Meister, gehen Sie mit dem Meister, sehen Sie durch den Meister und werden Sie der Meister.”
> – Zenbot-Sprichwort

# Zenbot Deutsch [![Build/Test Status](https://travis-ci.org/DeviaVir/zenbot.svg?branch=master)](https://travis-ci.org/DeviaVir/zenbot) 

Diese deutschsprachige Version v4.1.0.1 von Zenbot entspricht der englischen original Version v4.1.0 von [DeviaVir](https://github.com/DeviaVir/zenbot).

## Systemvorraussetzungen:  
Setzt 64-Bit-Prozessor und -Betriebssystem voraus
3 GB min. Arbeitsspeicher.  
| |Mindestanforderung:|Empfohlen: |
| ---------| ---------| ----------|
|Computer: |Raspberry Pi | PC|
|Prozessor:       |ARM 1 Kern mit 1,5 GHz ergibt 100 % Auslastung.| Raspberry Pi ARM 4 Kerne mit je 1,5 GHz ergeben eine Auslastung von 25 %.  
|Arbeitsspeicher: |3 GB RAM|8 GB RAM|
|Speicherplatz:   |?? GB verfügbarer Speicherplatz| |
|Betriebssystem:  |Linux|64-bit Windows 10|

Gilt noch nicht  
|Prozessor:|Intel Core i5 3570 oder AMD FX-8350|  
|Grafik:|GPU: NVIDIA GTX 760, AMD Radeon 7970 / R9280X GPU RAM: 2 GB Video Memory| |



## Mein Update
Für die Abhängigkeit "ccxt" wurde in package-lock.json von Version "1.33.64" auf Version "1.40.1" geändert und aktuallisiert. 
Die original Abhängigkeit steht in der Datei "package-lock-org.json" weiterhin und dient als Backup. 
Weitere Versionen von "ccxt" unter "https://registry.npmjs.org/ccxt/" aufindbar. 

### Meine Arbeit:  
1. Ich erstelle die Zenbot-Dokumentation neu und sortiere diese Neu. Inhaltlich bleibt diese gleichlautend, soll übersichtlicher werden. Fehler bei der Installtion auf Raspberry Pi 4B 8GB werden korrigiert. 
2. NPM wird aktualisiert und auf den aktuellen Stand aller notwendigen NPMs reduziert. 
3. Ein rebuild aller vorhanden Zenbot's wird durchgeführt und als ein neue Branche veröffendlicht. 
4. Eine Intregration von intressanten Forks wird herbei geführt. 

5. Ein Dokumentationsserver, der es ermöglicht, den Inhalt der Dokumentation als Webseite zu starten und im Browser nachlesbar zu machen. 


## Erstellen der Dokumentation
Hiermit sollen Sie künftig sich selbst eine Dokumentation als Webseite mit erstellen können, die Sie dann im Ihrem Browser aufrufen können. 

- Klonen Sie es: `git clone https://github.com/dwhr-pi/zenbot.git`
- Abhängigkeiten installieren/aktualisieren: `pip3 install -Ur requirements.txt`
- Verzeichnis wechseln: `cd zenbot`
- Führen Sie im Stammverzeichnis Folgendes aus: `mkdocs serve`

- Update bzw. Upgrade von Phyton durchführen `sudo /usr/bin/python3 -m pip install --upgrade pip`

Es baut die statischen HTML-Seiten in ein temporäres Verzeichnis und startet einen lokalen Webserver unter `http://localhost:8001`. Wenn Sie Probleme beim Zugriff auf die MkDocs-Website haben, können Sie auch eine bestimmte IP-Adresse oder alle IP-Adressen abhören, z. B. `mkdocs serve -a 0.0.0.0:8001`.  



## MongoDB - Das Problem auf dem Raspbian!

## Inhaltsverzeichnis

- ### exchanges
- [bitstamp-de.md](docs/exchanges/bitstamp-de.md) Fügen Sie börsenspezifische Tipps hinzu, um anderen zu helfen, ähnliche Kopfschmerzen zu vermeiden.(https://github.com/DeviaVir/zenbot/pull/908)

- [bitstamp.md](docs/exchanges/bitstamp.md) [Add exchange-specific tips to help others avoid similar headaches.](https://github.com/DeviaVir/zenbot/pull/908)
- [gdax-de.md](docs/exchanges/gdax-de.md) Add files via upload
- [gdax-en.md](docs/exchanges/gdax-en.md)  Rename gdax.md to gdax-en.md
- [gdax.md](docs/exchanges/gdax.md)  Add files via upload
- [kraken-de.md](docs/exchanges/kraken-de.md) Update kraken-de.md
- [kraken-en.md](docs/exchanges/kraken-en.md) Deutsche Übersetzung, der Doc, Readme und config.js Dateien
- [kraken.md](docs/exchanges/kraken.md) Add exchange-specific tips to help others avoid similar headaches. (D…
- [readme-de.md](docs/exchanges/readme-de.md) Update readme-de.md
- [readme-en.md](docs/exchanges/readme-en.md) Update readme-en.md




- ### installation
- [README-de.md](docs/installation/README-de.md)README-de.md Deutsche Übersetzung, der Doc, Readme und config.js Dateien
- [README-en.md](docs/installation/FAQ-de.md) Deutsche Übersetzung, der Doc, Readme und config.js Dateien
- [README.md](docs/installation/README.md)  WIP: Rework docs (DeviaVir#1816)
- [Installation.md](docs/installation/Installation.md) Schnell Installation

- [debian-ubuntu-de.md](docs/installation/debian-ubuntu-de.md) Deutsche Übersetzung, der Doc, Readme und config.js Dateien
- [debian-ubuntu-en.md](docs/installation/debian-ubuntu-en.md) Deutsche Übersetzung, der Doc, Readme und config.js Dateien
- [debian-ubuntu.md](docs/installation/debian-ubuntu.md) Update file for last version on ubuntu 20.04 (DeviaVir#2539)
- [docker-de.md](docs/installation/docker-de.md) Deutsche Übersetzung, der Doc, Readme und config.js Dateien
- [docker-en.md](docs/installation/docker-en.md) Deutsche Übersetzung, der Doc, Readme und config.js Dateien
- [docker.md](docs/installation/docker.md) WIP: Rework docs (DeviaVir#1816)
- [raspberrypi-de.md](docs/installation/raspberrypi-de.md) Deutsche Übersetzung, der Doc, Readme und config.js Dateien
- [raspberrypi-en.md](docs/installation/raspberrypi-en.md) Deutsche Übersetzung, der Doc, Readme und config.js Dateien
- [raspberrypi.md](docs/installation/raspberrypi.md) WIP: Rework docs (DeviaVir#1816)
- [requirements-de.md](docs/installation/requirements-de.md) Deutsche Übersetzung, der Doc, Readme und config.js Dateien
- [requirements-en.md](docs/installation/requirements-en.md) Deutsche Übersetzung, der Doc, Readme und config.js Dateien
- [requirements.md](docs/installation/requirements.md) WIP: Rework docs (DeviaVir#1816)
- [README.md](docs/installation/README.md) 




- ### notifiers
- [README-de.md](docs/notifiers/README-de.md) Update README-de.md
- [README-en.md](docs/notifiers/README-en.md) Deutsche Übersetzung, der Doc, Readme und config.js Dateien
- [README.md](docs/notifiers/README.md) Add notifications to ADAMANT Messenger




- ### scripts
- [auto_backtester-de.md](docs/scripts/auto_backtester-de.md) fehlt Deutsche Übersetzung, der Doc, Readme und config.js Dateien
- [auto_backtester-en.md](docs/scripts/auto_backtester-en.md) fehlt Deutsche Übersetzung, der Doc, Readme und config.js Dateien
- [auto_backtester.md](docs/scripts/auto_backtester.md) fehlt Deutsche Übersetzung, der Doc, Readme und config.js Dateien
- [genetic_algo-de.md](docs/scripts/genetic_algo-de.md) fehlt Deutsche Übersetzung, der Doc, Readme und config.js Dateien
- [genetic_algo-en.md](docs/scripts/genetic_algo-en.md) fehlt Deutsche Übersetzung, der Doc, Readme und config.js Dateien
- [genetic_algo.md](docs/scripts/genetic_algo.md) fehlt Deutsche Übersetzung, der Doc, Readme und config.js Dateien

- [genetic_backtester-de.md](docs/scripts/genetic_backtester-de.md) Deutsche Übersetzung, der Doc, Readme und config.js Dateien
- [genetic_backtester-en.md](docs/scripts/genetic_backtester-en.md) Deutsche Übersetzung, der Doc, Readme und config.js Dateien
- [genetic_backtester.md](docs/scripts/genetic_backtester.md) Added -runGenerations parameter (DeviaVir#1504)
- [readme-de.md](docs/scripts/readme-de.md) Update readme-de.md
- [readme-en.md](docs/scripts/readme-en.md) Deutsche Übersetzung, der Doc, Readme und config.js Dateien
- [readme.md](docs/scripts/readme.md) Update readme.md




- ### strategies
- [forex_analytics-de.md](docs/strategies/forex_analytics-de.md) Deutsche Übersetzung, der Doc, Readme und config.js Dateien
- [forex_analytics.md](docs/strategies/forex_analytics.md) Removed forex_analytics
- [howto_create_strategy-de.md](docs/strategies/howto_create_strategy-de.md) Deutsche Übersetzung, der Doc, Readme und config.js Dateien
- [howto_create_strategy.md](docs/strategies/howto_create_strategy.md) Create howto_create_strategy.md (DeviaVir#2555)
- [list-strategies-de.md](docs/strategies/list-strategies-de.md) Deutsche Übersetzung, der Doc, Readme und config.js Dateien
- [list-strategies-en.md](docs/strategies/list-strategies-en.md) Deutsche Übersetzung, der Doc, Readme und config.js Dateien
- [list-strategies.md](docs/strategies/list-strategies.md) Remove forex_analytics (DeviaVir#1937)
- [macd-de.md](docs/strategies/macd-de.md) Deutsche Übersetzung, der Doc, Readme und config.js Dateien
- [macd-en.md](docs/strategies/macd-en.md) Deutsche Übersetzung, der Doc, Readme und config.js Dateien
- [macd.md](docs/strategies/macd.md) WIP: Rework docs (DeviaVir#1816)
- [noop-de.md](docs/strategies/noop-de.md) Deutsche Übersetzung, der Doc, Readme und config.js Dateien
- [noop-en.md](docs/strategies/noop-en.md) Deutsche Übersetzung, der Doc, Readme und config.js Dateien
- [noop.md](docs/strategies/noop.md) WIP: Rework docs (DeviaVir#1816)
- [rsi-de.md](docs/strategies/rsi-de.md) Deutsche Übersetzung, der Doc, Readme und config.js Dateien
- [rsi-en.md](docs/strategies/rsi-en.md) rsi-en.md Deutsche Übersetzung, der Doc, Readme und config.js Dateien
- [rsi.md](docs/strategies/rsi.md) WIP: Rework docs (DeviaVir#1816)
- [sar-de.md](docs/strategies/sar-de.md)  Deutsche Übersetzung, der Doc, Readme und config.js Dateien
- [sar-en.md](docs/strategies/sar-en.md)  Deutsche Übersetzung, der Doc, Readme und config.js Dateien
- [sar.md](docs/strategies/sar.md)  WIP: Rework docs (DeviaVir#1816)
- [speed-de.md](docs/strategies/speed-de.md)  Deutsche Übersetzung, der Doc, Readme und config.js Dateien
- [speed-en.md](docs/strategies/speed-en.md)  Deutsche Übersetzung, der Doc, Readme und config.js Dateien
- [speed.md](docs/strategies/speed.md) WIP: Rework docs (DeviaVir#1816)
- [trend_ema-de.md](docs/strategies/trend_ema-de.md) Deutsche Übersetzung, der Doc, Readme und config.js Dateien
- [trend_ema-en.md](docs/strategies/trend_ema-en.md) Deutsche Übersetzung, der Doc, Readme und config.js Dateien
- [trend_ema.md](docs/strategies/trend_ema.md) WIP: Rework docs (DeviaVir#1816)
- [tweaking-de.md](docs/strategies/tweaking-de.md) Deutsche Übersetzung, der Doc, Readme und config.js Dateien
- [tweaking-en.md](docs/strategies/tweaking-en.md) Deutsche Übersetzung, der Doc, Readme und config.js Dateien
- [tweaking.md](docs/strategies/tweaking.md) WIP: Rework docs (DeviaVir#1816)




- ### FAQ und Readme
- [FAQ-de.md](docs/FAQ-de.md) Deutsche Übersetzung, der Doc, Readme und config.js Dateien
- [FAQ-en.md](docs/FAQ-en.md )  
- [FAQ.md](docs/FAQ.md) FAQ Häufig gestellte Fragen
- [README-de.md](docs/README-de.md) Deutsche Übersetzung, der Doc, Readme und config.js Dateien
- [README-en.md](docs/README-en.md)  Deutsche Übersetzung, der Doc, Readme und config.js Dateien
- [README.md](docs/README.md) Schnellstart
- [developers-de.md](docs/developers-de.md) Deutsche Übersetzung, der Doc, Readme und config.js Dateien
- [developers-en.md](docs/developers-en.md) Deutsche Übersetzung, der Doc, Readme und config.js Dateien
- [developers.md](docs/developers.md) Add files via upload




- ### scripts
- [scripts/genetic_algo/README-de.md](scripts/genetic_algo/README-de.md)  Genetischer Algorithmus von @arpheno
- [scripts/genetic_algo/README-en.md](scripts/genetic_algo/README-en.md)  Genetic Algorithm by @arpheno
- [scripts/genetic_algo/README.md](scripts/genetic_algo/README.md) Genetic Algorithm by @arpheno

## Aktueller Status

Zenbot 4 ist funktionsfähig, hat aber Probleme, zuverlässig Gewinne zu erzielen. An dieser Stelle **würde ich davon abraten, mit großen Beträgen zu handeln**, bis einige dieser Probleme gelöst werden können:

- Viele Leute melden [Verluste im Live-Handel](https://github.com/carlos8f/zenbot/issues/189), auch wenn die Simulationsergebnisse und/oder der Papierhandel positiv sind.
- Dies ist im Moment meine höchste Priorität, da ein unrentabler Bot nicht viel wert ist, aber verstehen Sie bitte, dass es schwierig ist, zuverlässig Gewinne zu erzielen, und ebenso einen realistischen Simulator.
- Die Verluste können darauf zurückzuführen sein, dass die Default-Strategie bei seitwärts gerichteten (nicht tendierenden) Marktbedingungen nicht gut funktioniert, während der Ausführung von Limit-Orders ausrutscht oder beides. Derzeit würde ich davon abraten, Zenbot auf einem Markt zu verwenden, der keinen Trend aufweist oder allgemein abwärts tendiert.
- Die Limit-Order-Strategie, die Zenbot verwendet, um Taker-Gebühren zu vermeiden, ist anfällig für Rennbedingungen und Verzögerungen. Es muss wahrscheinlich ein Modus für die Verwendung von marktüblichen Aufträgen geschaffen werden, der häufige Handelsstrategien aufgrund von Gebühren weniger rentabel machen kann, aber insgesamt eine zuverlässigere Ausführung.
- Eine bevorstehende Funktion wird es Zenbot ermöglichen, einen begrenzten Betrag Ihres Guthabens zu verwenden. Dies soll beim Experimentieren mit dem Live-Handel helfen, es wird die möglichen Verluste durch die oben genannten Probleme mindern.

Zenbot ist für mich ein Hobbyprojekt und es tut mir leid, dass ich mich ihm nicht Vollzeit widmen kann. Da ich immer beschäftigter werde, kann sich die Entwicklung ab hier etwas verlangsamen, also haben Sie bitte etwas Geduld, wenn Probleme nicht sofort behoben werden.

## Beschreibung

Zenbot ist ein Befehlszeilenbasierender-Kryptowährungs-Handelsbot, der dazu Node.js und die MongoDB verwendet. Es verfügt über:

- Vollautomatischer, auf technischen Analysen basierender Handelsansatz.
- Mit vollständiger Unterstützung für Binance, Bitfinex, Bitstamp, Bittrex, CEX.IO, GDAX, Gemini, HitBTC, Kraken, Poloniex, QuadrigaCX und TheRockTrading. Und funktioniert mit weiteren diversen Börsen [Exchanges]. Deren vollständige Unterstützung ist allerdings noch nicht abgeschlossen.
- Plugin-Architektur zur Implementierung der Exchangeunterstützung oder zum Schreiben neuer Strategien.
- Simulator für Backtesting-Strategien oder als Zip Backtesting-Strategien oder auf GitHub Backtesting-Strategien gegen historische Daten.
- Der Handelsmodus "Papier" arbeitet mit einem simulierten Kontostand, während Sie den Live-Markt beobachten.
- Konfigurierbare Verkaufsstopps, Kaufstopps und (nachlaufende) Gewinnstopps.
- Flexibler Stichprobenzeitraum und Handelshäufigkeit - durchschnittlich 1-2 Trades/Tag mit 1h Zeitraum, 15-50/Tag mit 5m Zeitraum.

## Haftungsausschluss

- Zenbot ist KEINE sichere Gewinnmaschine. Verwendung nur auf eigenes Risiko!
- Kryptowährung ist immer noch ein Experiment, und Zenbot auch. Das heißt, beide können jederzeit fehlschlagen.
- Das Ausführen eines Bots und das Handeln im Allgemeinen erfordern eine sorgfältige Untersuchung, der damit verbundenen Risiken und Parameter. Eine falsche Einstellung kann zu erheblichen Verlusten führen.
- Lassen Sie den Bot niemals eine längere Zeit unbeaufsichtigt. Zenbot weiß nicht, wann er aufhören soll. Seien Sie also bereit dies zu stoppen, wenn zu viel Verlust aufkommt.
- Oft sind die Standard-Handelsparameter im Vergleich zu einer Buy-Hold-Strategie unterdurchschnittlich. Führen Sie daher einige Simulationen durch und finden Sie die optimalen Parameter für die von Ihnen gewählten exchange/pair-Paar (Börse/Währungspaar), bevor Sie "All-in" gehen.

## Dokumentation

Die ausführliche Dokumentation befindet sich im docs-Ordner oder auf GitHub [docs-folder](docs/)-Ordner. .

### Fragen

Schauen Sie sich zuerst die [docs](docs/)-Dokumente an und es gibt auch [FAQs](docs/FAQ-de.md), die Ihre Fragen beantworten können. Wenn nicht, stellen Sie bitte (Programmier-) Fragen in Englischer Sprache zu Zenbot auf Reddit ([subreddit zenbot](https://reddit.com/r/zenbot)).

### Gemeinschaft

Treten Sie der [Zenbot-Community auf Reddit](https://reddit.com/r/zenbot) in Englischer Sprache bei!

## Spenden

PS: Einige haben gefragt, wie sie für die Zenbot-Entwicklung spenden können. Wir akzeptieren Spenden an die folgenden **Bitcoin-Adressen**:

### carlos8f's BTC (ursprünglicher Zenbot-Autor)

`187rmNSkSvehgcKpBunre6a5wA5hQQop6W`

### DeviaVir's BTC (aktueller Betreuer)

`3A5g4GQ2vmjNcnEschCweJJB4umzu66sdY`

### DWHR-Pi's BTC (aktueller Deutscher Übersetzer)

`17aJRRkpwAUHjFSrV9VqFv3ikLMM9n7drb`

![zenbot logo](assets/zenbot_square.png)

Thanks!

## Bemerkenswerte Forks (Gabelungen)
Diese Forks kann man sehr gut auch mit der [herokuapp](https://gitpop2.herokuapp.com/DeviaVir/zenbot) auffinden. 


- [bot18](https://medium.com/@carlos8f_11468/introducing-bot18-the-new-crypto-trading-bot-to-supersede-zenbot-and-unleash-the-zalgo-da8464b41e53)
- [magic8bot](https://github.com/notVitaliy/magic8bot)


- [Mit Trend_ema_rate.js und einigen intressanten Änderungen](http://ec2-3-135-246-139.us-east-2.compute.amazonaws.com:8080/projects/TEST/repos/zenbot/browse?at=8a86755753de65387da725187585cd577f6562a8)
- [Sim Run / Backtesting Automator für Zenbot](https://github.com/jefc1111/zenbot-sim-runner)
- [Sim Run / Backtesting Automator für Zenbot](https://www.reddit.com/r/zenbot/comments/nkyo79/im_building_a_sim_run_backtesting_automator_for/)

- [tabenius - Zenbot for kraken](https://github.com/tabenius/zenbot-kraken/tree/master)

- [multiple strategies in diferent periods with diferent combinations](https://github.com/marcelomf/tbfix)
- [Ältere Version von zenbot](https://github.com/7s4r/zenbot)
- [train.js - andere Version](http://ec2-3-135-246-139.us-east-2.compute.amazonaws.com:8080/projects/TEST/repos/zenbot/browse?at=e28aa61e54a0464e4a1eeeedda863aa75cc9902f)
- [Other Strategies](https://github.com/abelardojarab/zenbot/tree/unstable/extensions/strategies)


- [Questions tagged [zenbot]](https://stackoverflow.com/questions/tagged/zenbot)
- [Can I run Zenbot on Android?](https://stackoverflow.com/questions/62904463/can-i-run-zenbot-on-android)


- [Error: invalid bucket size spec: undefined](#https://stackoverflow.com/questions/47896238/error-invalid-bucket-size-spec-undefined)
- [Error: invalid bucket size spec: undefined](#https://github.com/DeviaVir/zenbot/issues/938)
- [Error: invalid bucket size spec: undefined](#https://github.com/DeviaVir/zenbot/pull/926)
- [Forex train not working...](https://www.reddit.com/r/zenbot/comments/8oinab/forex_train_not_working/)

- [Raspberry pi](https://www.reddit.com/r/zenbot/comments/mc5c8h/raspberry_pi/)
- [Trading multiple currencies on one exchange](https://www.reddit.com/r/zenbot/comments/jpjur9/trading_multiple_currencies_on_one_exchange/)
- [I'm not strong in javascript programming, and new to zenbot: where can I see the logic behind the arbitrage strategy in a human readable format (not in javascript)? or in javascript , but with detailled comments?](https://www.reddit.com/r/zenbot/comments/f4m07w/im_not_strong_in_javascript_programming_and_new/)
- [Cryptocurrency Trading Bot Developer](https://www.reddit.com/r/zenbot/comments/f9aa3c/cryptocurrency_trading_bot_developer/)
- [Must you use a strategy with only one Selector/Pair?](https://www.reddit.com/r/zenbot/comments/9ypuug/must_you_use_a_strategy_with_only_one_selectorpair/)


- [Made GUI and window manager for dip strategy. It's finally stable.](https://www.reddit.com/r/zenbot/comments/j4h4ze/made_gui_and_window_manager_for_dip_strategy_its/)
- [Reverse parameter gives interesting results for default sim command](https://www.reddit.com/r/zenbot/comments/j49cj8/reverse_parameter_gives_interesting_results_for/)
- [Zenbot is not executing trades?](https://www.reddit.com/r/zenbot/comments/ip21zn/zenbot_is_not_executing_trades/)

- [Stop profit with trailing stop](https://www.reddit.com/r/zenbot/comments/ipnhuy/stop_profit_with_trailing_stop/)
- [Binance.US Support](https://www.reddit.com/r/zenbot/comments/iv56am/binanceus_support/)
- [Made first zenbot strategy then made a batch script to simulate the best values](https://www.reddit.com/r/zenbot/comments/i85ude/made_first_zenbot_strategy_then_made_a_batch/)


- [Getting Started With Algorithmic Crypto Trading](https://jaynagpaul.com/algorithmic-crypto-trading)
- [Run a Crypto Trading Bot on Cloud Foundry](https://blog.bespinian.io/posts/run-a-crypto-trading-bot-on-cloud-foundry/)

## Videos

- [1. ZenBot install on Ubuntu 16.04](https://www.youtube.com/watch?v=BEhU55W9pBI)
- [2. Zenbot: How to simply Buy and Sell with limit orders?](https://www.youtube.com/watch?v=WeA7q67Jt1k)
- [3. A deeper introduction to Zenbot trading bot](https://www.youtube.com/watch?v=wmtFmxc0dOM)
- [4. Trying_to_understand_how_Zenbot_strategies_are_working](https://www.youtube.com/watch?v=zdxWANfCbU4)

- [Zenbot Playlist at Youtube](https://www.youtube.com/playlist?list=PLSeF7wP23srtfvrjddCGUIdvfujWNf7tJ)
- [Zenbot Review: Honest User Experience with the Best Trading Bot for Crypto & More ](https://youtu.be/AQUbIg_GsiU?si=Gj77kSiT_kjABY4d)
- [Zenbot Trading Bot: une vidéo d'introduction](https://youtu.be/C5kdAqE6JpA?si=Nx3aHe9G31ACXbDh)
- []()
- []()
- - -


Neue: CroneJob
- [Open terminal on startup and run command](https://askubuntu.com/questions/756967/open-terminal-on-startup-and-run-command)  
- [autostart terminal command Linux - Suchen](https://www.bing.com/search?&pc=HWMB&form=HWMBFC&q=autostart+terminal+command+Linux)  
- [linux start terminal from command line - Suchen](https://www.bing.com/search?&pc=HWMB&form=HWMBFC&q=linux+start+terminal+from+command+line)  
-[ubuntu auto start shell script - Suchen](https://www.bing.com/search?&pc=HWMB&form=HWMBFC&q=ubuntu+auto+start+shell+script)  
-[Startup Auto-Execution Bash Script](https://askubuntu.com/questions/1214255/startup-auto-execution-bash-script)  
-[How to run scripts on start up?](https://askubuntu.com/questions/814/how-to-run-scripts-on-start-up)  


## Autostart CroneJob
One approach is to add an @reboot cron task:

Running 'crontab -e' will allow you to edit your cron.

Adding a line like this to it: '@reboot /path/to/zenbot-start.sh' will execute that script once your computer boots up.

The file 'zenbot-start.sh' should in be your startup critical commands for Zenbot. 
e. G. : zenbot.sh 

zenbot.sh sim binance.BTC-USD --profit_stop_enable_pct 10 --profit_stop_pct 1 --sell_rate -0.006 --trend_ema 36 --period 1h --strategy trend_ema_rate --sell_stop_pct 4 --buy_stop_pct 0 --max_sell_loss_pct 25 --max_slippage_pct 2 --buy_pct 98 --sell_pct 98 --markup_pct 0 --currency_capital 0 --asset_capital 0.00002 --order_adjust_time 30000 --rsi_periods 14 --min_periods 37 --max_sell_duration 4


## Lizenz: MIT

- Copyright (C) 2017-2022 Carlos Rodriguez
- Copyright (C) 2017-2022 Terra Eclipse, Inc. (http://www.terraeclipse.com/)

Hiermit wird jeder Person, die eine Kopie dieser Software und der zugehörigen Dokumentationsdateien (die &quot;Software&quot;) erhält, kostenlos die Erlaubnis erteilt, uneingeschränkt mit der Software umzugehen. 
Einschließlich, jedoch nicht beschränkt auf die Rechte zur Nutzung, zum Kopieren, Ändern, Zusammenführen, veröffentlichen, vertreiben, unterlizenzieren und/oder verkaufen Kopien der Software und erlaubten Personen, denen die Software zur Verfügung gestellt wird, dies unter den folgenden Bedingungen: 

Der obige Urheberrechtshinweis und dieser Erlaubnishinweis sind in allen Kopien oder wesentlichen Teilen der Software enthalten.

DIE SOFTWARE WIRD &quot;WIE GESEHEN&quot; OHNE JEGLICHE AUSDRÜCKLICHE ODER STILLSCHWEIGENDE GEWÄHRLEISTUNG ZUR VERFÜGUNG GESTELLT. 
EINSCHLIESSLICH DER GEWÄHRLEISTUNG FÜR MARKTGÄNGIGKEIT, EIGNUNG FÜR EINEN BESTIMMTEN ZWECK UND NICHTVERLETZUNG. 
IN KEINEM FALL HAFTEN DIE AUTOREN ODER COPYRIGHT-INHABER FÜR JEGLICHE ANSPRÜCHE, SCHÄDEN ODER ANDERE HAFTUNGEN, OB VERTRAGS-, TORT- ODER ANDERWEITIGE MASSNAHMEN AUS, AUS ODER IM ZUSAMMENHANG MIT DER SOFTWARE ODER DER NUTZUNG ODER ANDEREN ANGEBOTE SOFTWARE. 
