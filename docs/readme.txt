link al corso https://app.pluralsight.com/library/courses/rxjs-angular-reactive-development/table-of-contents
repo git https://github.com/DeborahK/Angular-RxJS

Introduzione
	rxjs permette raccogliere i dati da multipli sorgenti, combinare i dati per una visualizzazione, fare caching di dati per migliorare le prestazioni, etc.
	RxJS - Reactive Extension For JavaScript
	def: "RxJS is a library for composing asynchronous and event-based programs by using observable sequences"
	aka Gestione dati nel momento che arrivano
	iter:
		1. facciamo collect di dati (raccolta)
		2. facciamo passare i dati raccoltati tra un set di operazioni
			- qui possiamo eseguire la trasformazione di dati
			- filtrare
			- processare in un certo modo
		3. possiamo combinare piu' stream in un unico (es. dati di clienti con la fatturazione, in uscita atteniamo unico stream di clienti con i propri dati di fatturazione)
		4. possiamo mettere i dati in una cache (es. a livello del nostro servizio che esegue la chiamata HTTP, per non rifarla in un secondo momento)
	Perche' vogliamo usare RxJS e non:
		- Callbacks (difficile da gestire quando abbiamo tante operazioni assincrone innestate, aka callback hell)
		- Promises (fornisce solo un unico valore futuro, non e' cancellabile)
		- async/await - imissione singola di un evento assincrono, non e' cancellabile 
	Vantaggi di RxJS:
		- unica tecnica di lavorare con vari tipi di dati proveninti da diversi sorgenti (array, file, db, etc.)
		- possiamo comporre i dati facilmente, utile per esempio alle nostre View che possano richiedere dati da diversi sorgenti
		- concetto di osservazione, rimaniamo in ascolto sulla modifica di dati
		- RxJS e' lazy, finche non eseguiamo subscribe, non succede niente
		- possiamo gestire errori usando error handles
		- sono cancellabili
	IN che modo Angular usa RxJS:
		in Routing, per rimanere in ascolto sul cambiamento delle rotte o i dati delle rotte (this.route.paramMap, this.route.data, this.router.events)
		ub Reactive Forms, ascolto di cambiamento valori nel campi di input di una form (this.productForm.valueChanges)
		in HttpClient
	NOTA: possiamo usare RxJS nel nostro codice per fare reactive development
		def: " ... a declarative programming paradigm concerns with data streams and propagation of change"
			 " the essense of functional reactive programming is to specify dynamic behavior of a value completely of the time of declaration" 
	Reactive development
		- reazione veloce all'iterazione dell'utente
		- resiliente ai fallimenti
		- reattivo nel cambimento dello stato
RxJS Terms and Syntax
	NOTA: vedi slide di confronto tra la catena di mele e RxJS - ottimo esempio nel mondo reale!!!
	RxJS: facciamo partire lo stream eseguendo subscribe -> facciamo passare i nostri dati tra i pipe di operatori -> 
		il nostro Observer prevede seguenti funzioni: next(), error(), complete() 
		-> possiamo fermare lo stream facendo unsubscribe()
	Observer/Subscriber
		Observer e' un oggetto che monitore lo stream (se riceve next item, lo processa, se succede un errore, lo gestisce, se stream viene completato, si ferma) e  risponde alle sue notifiche (quelli dello stream)
		Observer e' una interfaccia che definisce tre metodi:
			next()
			error()
			complete()
		NOTA: vedi def. di Observer nello slide!!!
		Una delle classi che implementa interfaccia Observer e' Subscriber
			implementa i tre metodi e puo' fare unsubscrive da Observable
		Observer osserva lo stream...
	Observable Stream (Observable)
		e' un stream di dati, opzionalmente prodotti durante un periodo di tempo
			- numeri
			- stringhe
			- eventi
			- oggetti (object literals)
			- risposta di una richiesta HTTP
			- altri stream observable
		NOTA: sono la stessa cosa Observable Stream - Observable - Stream 
		Observables possano essere sincroni e asincroni, imettere un numeri finito o no di valori
		NOTA: vedi il formato piu' lungo di dichiarazione di un Observable per capire meglio come funziona.
		demo/esempio: abbiamo definito Observer (implementazione di tre metodi) e Observable (lo stream di dati)
					  pero non facendo subscribe, non siamo ancora in ascolto sullo stream
	Far partire Observable Stream
		dobbiamo eseguire subscribe()
		quando passiamo Observer nel parametro al metodo subscribe possiamo passare 3 arrow functions, dove la prima e' implementazione del metodo next(), secondo e' la gestione dell'errore, la terza il fn eseguita alla chiusura dello stream
	Fermare observable stream
		NOTA: fermare correttamente observable stream ci fa evitare memory potenziali leaks
		metodo Unsubscribe()	
			il metodo subscribe() ritorna la subscription, su questa subscription possiamo chimare unsubscriber() per fermare lo stream
	Funzioni di creazione
		"in angular we often work with observable that angular creates for us"
		possiamo creare un Observable usando il costruttore new Observable(), ma non e' una strada da preferire
		possiamo usare la funzione of()
		es.
			const appleStream = of('Apple1', 'Apple2')
			const appleStream = from(['Apple1', 'Apple2'])
		fn of() e from() sono funzioni statiche
		NOTA: se chiamiamo of(['Apple1', 'Apple2']) viene emmesso solo un valore - array di stringhe, per raggiungere effetto di prima, dobbiamo usare operatore spread of(...apples)
		es. di creare Observable di eventi:
			@ViewChild('para') par: ElementRef;
			ngAfterViewInit() {
				const parStream = fromEvent(this.par.nativeElement, 'click').subscribe(console.log)
			}
	
			const num = interval(1000).subscribe(console.log)
	https://stackblitz.com/ - per fare le prove online
	NOTA: se arriva un errore nello stream, viene chiamata arrow fn di gestione errore, e lo stream viene fermato, il metodo complete() NON viene chiamato
Operatori RxJS
	un operatore e' una funzione che manipola e trasforma item in un observable stream
	registriamo operatori in sequenza usando operatore observable pipe()
	es.
		of(2,4,6).pipe(
			map(item => item * 2),
			tap(item => console.log(item)),
			take(2)
		).subscribe(console.log)
	possiamo vedere il nostro insieme di operatori come una pipeline di operazioni eseguite sul nostro stream
	ci sono 100 passa operatori RxJS, vedi slide del corso 
		vedi qui https://rxjs.dev/api
	NOTA: l'albero decisionale https://rxjs.dev/operator-decision-tree aiuta a capire che operatore puoi usare per il tuo scopo
	operatore map()
		transforma item
	operatore tap()
		non modifica lo stream, utile per debug
		puo' produrre un side effect, fuori dallo stream
	operatore take()
		prende un numero specifico di item dallo stream
		limita uno stream illimitato
	NOTA: se passiamo piu' operatori RxJS al pipe(), cmq viene sempre processato un item da tutti operatori alla volta!! se take(2) e abbiamo anche un map(), il map viene eseguito solo per i primi due item!!
	take e' un operatore di filtro
Going reactive
	focus sugli stream di dati assincroni
	Async Pipe
		sottoscrizione automatica all'observable quando il componente viene inizializzato
		ritorna ogni valore emmesso da observable
		quando viene emmesso nuovo item, il component viene marcato per la verifica di cambiamenti (to be checked for changes)
		unsubscribe avviene in modo automatico quando il componente viene distrutto
		es:
			"products$ | async"
		recap: non dobbiamo fare subscribe e unsubscribe
	Gestione errori
		un errore ferma uno stream observable
		ci sono due strategie per gestire l'errore:
			1. Catch and Replace
				errore viene rimpiazzato con un'altro observable, per esempio usando i dati locali o dati cablati
				possiamo ritornare un observable che emette empty observable o empty array (replacement observable)
				o ritorniamo EMPTY - e' una costante RxJS che imette no items e viene completata immediatamente
			2. Catch and Rethrow
				qui possiamo loggare errore ricevuto e propagarlo successivamente verso la catena
				(... return throwError(err) ...)
				la fn throwError() ritorna un Observable senza item e imette subito una notifica di errore fermando il proprio Observable
		viene usato operatore catchError(this.handleError)
			questo operatore deve essere registrato successivamento all'operatore che puo' sollevare un errore
			e' un operatore per gestire l'errore 
		NOTA: vedi esempio negli slide!!
		Costante EMPTY - crea observable che non imette nessun item
			e' utile quando riceviamo un errore (per es. dal BE di servizio) e vogliamo ritornare un risultato vuoto
			oppure non abbiamo i default per nostri valori che stiamo recuperando in qualche modo - ritorniamo EMPTY
	Migliorare change detection
		angular gestisce due strategie
			- Default
				usa la strategia di default checkAlways
				ogni componente e' checked quando ogni modifica e' stata catturata			
			- OnPush
				migliora le prestazioni minimizzando i cicli di change detection
				il componente e' checked solo se:
					* proprieta' @Input sono cambiati
					* e' stato emmesso un evento
					* bound observable emits, solo se e' agganciato al template usando async pipe
	Declarative pattern for Data Retrieval
		pro:
			- bilanciare la potenza di RxJS observables and operators
			- compibare stream in modo effettivo
			- condivisione facilitata di observable 
		il servizio ha la proprieta' tipo products$ che contiene la chiamata assincrona (ritorna un observable)
		i componenti usano questa proprieta' public per accedere a questo Observable Stream e aggiungono un catchError se serve
		nel template su usa il pipe async per accedere a questo observable - VEDI CODICE nel repo git!!!
Mappare i dati	
	il mapping e' utile da usare quando vogliamo modificare la forma il valore di dati ritornati dal BE, per es:
		- modificare il valore
		- trasformare il valore ('Y' -> true, 'N' -> false)
		- cambiare il nome del campo (p_nm -> productName)
		- aggiungere un campo calcolato
	viene usato operatore map()
		attenzione al tipo finale di observable 
		se dal BE ci arriva un array di item dobbiamo applicare la fn map() a questo array per esere il mapping necessario, ritornando un array di item (usiamo spread operator per creare oggetti nuovi cp di quelli arrivati dal BE ma con 
			qualche proprieta' modificata)
Combinazione di stream
	utile quando lavoriamo con piu' sorgenti dati
	cambiato la lista di item quando varia il filtro
	semplificare il codice di template facendo merge di stream multipli in un unico 
	operatori RxJS che vediamo sono combineLatest, forkJoin, withLatestFrom
	combinazione di funzioni/operatori
		vedi slide con Marble Diagrams
	tipi di operatori/funzioni di combinazione
		- combinazioni in un unico stream di stream con singoli item
		- flatten higher order observables (lo stream finale viene appiattito
		- emissione di valori combinati (ogni singolo valore di ogni stream finisce in un arrai dello stream finale)
	operatore combineLatest
		usa ultimo valore di ogni stream
		e' una static creation fn, non e' un operatore pipeable
		VEDI MARBLE DIAGRAM per capire meglio!
		e' una combination function 
		riceve in input gli stream, esegue subscribe, e crea un output stream
		quando tutti stream hanno emmesso al meno un valore, fn emette il valore nello stream di output (e' un item di tipo array contenente gli item di altri stream)
		fn viene completata quando tutti stream sono completati
		quando usare:
			- rivalutare lo stato dopo una action
		NOTA: un nuovo item viene creato nello stream finale quando viene emmesso un nuovo item in qualsiasi stream in input - item finale conside ultimi item di tutti stream -> e' possibile usare per filtri e ragruppamenti
			vedi MarbleDiagram di esempio nella slide "Use combineLatest"
	operatore forkJoin
		crea observable dove ogni item viene definito come ultimo di ogni stream di input
		e' una static creation fn, non e' un operatore pipeable
		a forkJoin importa solo ultimo item di ogni stream
		quando tutti stream di input sono completati forkJoin creao il suo stream considerando ultimo valori di ogni stream di input
		utile da usare quando vogliamo eseguire piu' chiamate HTTP e aspettare il risultato di tutti per costruire uno stream di output
		NON usare forkJoin con stream che non si completano
	operatore withLatestFrom
		usa ultimi valori di ogni stream ma solo quando sourse stream emits 
		vedi Marble Diagram!
		es: apples$.pipe(withLatestFrom(stick$, caramel$))
		da usare per reagire ai cambiamenti in un unico stream o per regolare output di altri stream
	demo:
		mappiamo ID in una Stringa per mostrare sulla pagina un nome parlante all'utente (mostriamo il nome di categoria  di un prodotto)
		i prodotti sono recuperati con una chiamata HTTP
		le categorie sono recuperati con un'altra chiamata HTTP
		NOTA: chiamata HTTP ritorna solo un item in una observable stream che e' la risposta HTTP
		quindi possiamo usare uno di tre operatori visti prima, scegliamo combineLatest
Reacting to actions
	qui parliamo in che modo possiamo addottare l'aproccio reactive alle iterazione dell'utente (es. cambiamento di un filtro)
	qui vediamo: filter, startWith, Subject, behaviorSubject
	filtering a stream
		operatore filter()
		e' un operatore di trasformazione
		demo
Data Stream vs Action Stream
	Data Stream e' lo stream di dati (es. risposta HTTP)
	Action Stream e' lo stream di azioni di un utente per esempio (click, filtri etc)
	possiamo combinare i due stream per aggiornare i dati nella UI in base alle azione dell'utente
	la strada piu' comune per creare Action Stream e' usare Subject / behaviorSubject
	Observable sono unicast - ogni subscriber ha la sua copia di observable stream
	Subject sono multicast - lo stresso stream e' condiviso da piu' subscriber 
	behaviorSubject si comporta come Subject con unica differenza, dobbiamo passare il valore iniziale quando lo creiamo (per es. 0)
	reagire alle action
		- creiamo action stream creando Subject / behaviorSubject
		- combiniamo action stream con data stream 
		- facciamo emit di un valore all'action stream ogni volta che viene eseguita una action 
		in questo modo viene eseguita observable pipeline creando effetto desiderato
	far partire Action Stream con un valore iniziale
		possiamo usare operatore startWith()
			e' un combination operator, combina valore iniziale con input stream, il tipo di valore iniziale deve combaciare con il tipo di observable stream
		possiamo usare behaviorSubject
	recap: Data Stream reagisce in base all'Action Stream...
			Subject e' un tipo speciale di Observable
Reagire alle action, esempi
	in questo modulo vediamo 'React to selection', 'React to errors', 'React to add operations'
	operatori merge e scan
	demo: per recuperare un singolo prodotto dalla lista che abbiamo gia' ricevuto dal BE definiamo un nuovo Observable nel file di servizio
			vedi il codice 
	NOTA: quando chiamiamo next() su un subject viene emesso un nuovo valore nell'Action Stream, ovviamente dobbiamo avere Action Stream che referenzia questo Subject!!!
	reagire agli errori
		come visualizzare i messaggi di errore usando observable streams
		NOTA: se impostiamo changeDetection: ChangeDetectionStrategy.OnPush a livello di componente, il componente esegue la verifica di cambiamenti solo se cambia il valore di una prop @Input() o un observable gestitio con async pipe!!!
				nessuna reazione se cambia il valore di una prop locale!!!
	reagire all'operazione di ADD (aka inserimento nuovo item, prodotto nel nostro caso)
		funzione merge
			esegue il merge di piu' stream in un unico stream 
			e' una fn di creazione statica, NON e' un operatore pipeable
			merge e' una fn di combinazione 
			riceve in input observable streams e produce uno stream di output
			quando ogni stream di input imette in item tale finisce subito nell'output stream, finche tutti input stream non sono completati
		operatore scan
			accumula items in un stream 
			scan((acc, curr) => acc + curr), acc - accumulatore, curr - il valore corrente
			usato per fare un conteggio totale, accumulare item in un array
			NOTA: vedi Marvel Diagram per capire meglio!!!
			e' un operatore di trasformazione 
		NOTA: merge e scan lavorano insieme molto bene per reagire ad una azione di Inserimento (Add action)
			abbiamo Data Stream di prodotti -> Action Stream che produce la notifica quando un nuovo prodotto viene aggiunto -> Action Stream imette nuovo prodotto 
				-> prima di tutto facciamo merge del nostro Data Stream e Action Stream -> cosi otteniamo singolo stream con tutti prodotti + prodotto appena aggiunto 
				-> eseguiamo scan() per accumulare il nuovo prodotto in un array di prodotti 
			VEDI DEMO e codice!!!!
	NOTA: il metodo che esegue next() su un Subject e' meglio scrivere nel file dove e' stato definito il Subject (es. file contenente il servizio) - codice piu' organizzato
Caching Observables
	salvataggio di dati recuperati in locale, senza rifare la chiamata al BE
	salvataggio esternamente o in memoria, runtime cacheing (eliminata se utente abbandona l'applicazione)
	vantaggi di eseguire il caching di dati
		- migliore responsivness 
		- riduce bandwidth e consumo di rete
		- riduce il carico sul server 
		- riduce computazioni ridondanti
	patterns per il caching di dati
		1. Definire la proprieta' a livello di servizio per salvare i dati in memoria 
			ma non e' una modalita' dichiarativa (vedi es. nella slide)
		2. Usare approccio reactive e operatore shareReplay()
		shareReplay(): condivide lo stream con altri subscriber, ripete numero definito di imissioni su ogni subscription
		es. shareReplay(1) - ripete ultima imissione 
			usato per fare il caching di dati nell'applicazione
			vedi Marble Diagram nella slide!
		shareReplay() e' un operatore multicast, ritorna Subject che condivide la stessa subscription alla sorgente sottostante
		accetta in input la dimensione di buffer, e' il numero di item cached e replayed per ogni subscriber
		sul subscriber ripete il numero specificato di imissioni
		items rimangono in memoria per sempre, anche quando non ci sono piu' subscriber
	demo:
		applichiamo shareReplay() x le categorie
		NOTA: con chiamate HTTP e' sufficiente shareReplay(1), la risposta HTTP e' unico item che contiene i nostri dati (array di prodotti)
		NOTA: fare attenzione dove piazzare shareReplay(), magari non nel posto dove viene eseguita la chiamata HTTP ma dopo qualche elaborazione a FE fatta successivamente (per. con operatore map())
	da quello che vedo i dati sono recuperati di nuovo dopo l'apertura del browser, o aggiornamento della pagina con F5!!!
	invalidazione di cache
		- valutare la fluidita di dati (ha senso per dati che cambiano raramente, per es. categoria di prodotti)
		- comportamento dell'utente (se utente lascia l'app aperta tutto il giorno e' necessario introdurre qualche regola di invalidazione della cache, ma se utente chiude e apre app frequentemente, non serve)
		- possiamo considerare un intervallo di tempo quando invalidare la cache (es. ogni 10min, ogni 1h)
		- dare la possibilita' all'utente di refreshare i dati
		- fare refresh quando si esegue un update
Higher-order mapping operators
	sono observable chiamati all'interno di altri observable (per es. all'interno di operatore map())
	outer observable - observable di piu' alto livello 
	inner observables - observable interni 
	(vedi slide per l'immagine di esempio)
	nasce il problema di eseguire subscribe() sugli inner observable, idem per unsubscribe 
	e' qui che ci vengono di aiuto Higher Order Mapping Operators che trasformano Higher Order Observables!
	in questo modulo vediamo: concatMap(), mergeMap(), switchMap()
	NOTA: quando vediamo il tipo Observable<Observable<...>> sappiamo che stiamo lavorando con higher order observable 
	dobbiamo usare operatori xxxMap()
		questi operatori mappano ogni valore dal Observable sorgente (outer) in Observable nuovo (inner)
		eseguono subsribe e unsubscribe da ogni inner observable
		imettono il risultato in un output observable 
	operatore concatMap()
		higher order mapping + concatenazione
		trasforma ogni item emesso in un nuovo (inner) observable come definito dalla funzione 
			concatMap(i => of(i))
		NOTA: aspetta che ogni inner observable termina prima di processare il prossimo
		output di ogni inner observable e' concatenato in uno stream finale in sequenza (aka processamento di ogni inner observable in sequenza)
		NOTA: vedi la slide con una spiegazione dettagliata di come funziona concatMap()!
		quando usare concatMap:
			- dobbiamo processare item in sequenza
			- quando dobbiamo attendere che un inner observable termina prima di processare il successivo (non e' un processamento parallelo!!!)
		esempio:
			abbiamo N ids e dobbiamo recuperare i dati di questi id in sequenza
			idem per aggiornamento di dati 
		demo
			vedendo i log si rende conto che concatMap gestisce una coda di inner observables, in sequenza fa subscribe, processa, e unsubscribe di ogni inner observable alla volta...
	operatore mergeMap()
		higher order mapping + merging
		trasforma ogni item emesso in un nuovo (inner) observable come definito dalla funzione 
			mergeMap(i => of(i))
		NOTA: esegue inner observables in parallelo e mergia il risultato
		mergeMap noto anche come flatMap
		NOTA: vedi la slide con una spiegazione dettagliata di come funziona mergeMap()!
		quando usare concatMap:
			- dobbiamo processare item in parallelo
			- ordine non conta
		esempio:
			abbiamo N ids e dobbiamo recuperare i dati indipendentemente dall'ordine
		demo
	operatore switchMap()
		higher order mapping + switching
		trasforma ogni item emesso in un nuovo (inner) observable come definito dalla funzione 
			switchMap(i => of(i))
		NOTA: esegue unsubscribe e ferma (stops) un inner observable precedente e switcha su inner observable successivo 
		NOTA: vedi la slide con una spiegazione dettagliata di come funziona switchMap()!
		ferma inner observable precedente prima di passare al prossimo
		cioe', quando arriva un nuovo item nello stream outer, se in corso il processamento di qualche inner item, esso viene fermato senza aspettare il completamento.. e si prosegue con il processamento di item appena arrivato..
		quando usare switchMap:
			- type ahead o auto completamento (per es. ricerca)
			- utente seleziona item da una lista (uno alla volta, sbaglia, seleziona subito un'altro - non dobbiamo aspettare il processamento del primo selezionato per errore)
		demo 
Combinare tutti stream
	parliamo di: gestione di dati relativi
	related data streams
		una view puo' richiedere piu' data streams, dati che sono collegati tra di loro 
		per es. clienti con i dati delle fatture, o prodotti con i propri fornitori
		una delle tecniche per gestire dati relativi e' di farlo a BE (unire dati da BE)
		puo' essere non sempre possibile avere un endpoint che ti ritorna tutti i dati (sistema legacy, sistema di terzi)
		ci sono vari approcci per recuperare i dati per la nostra view:
			- get it all
				approccio usato per le categorie, recuperiamo subito sia prodotti e categorie (usato operatore combineLatest)
				da usare se il DataSet ha una dimensione ragionevole (non troppo grande)
			- just in time 
				da usare quando il DataSet e' grande
				qui usiamo per es. operatore mergeMap() e recuperiamo i dati relativi di uno outer stream in parallelo (per esempio i dati di prodotti visualizzati nella prima pagina)
		demo: get it all
			NOTA: recuperiamo tutti i fornitori subito e li mettiamo nella cache 
			vedi il codice 
		demo: just in time 
			NOTA: vedi la slide che spiega la teoria di come recuperare i dati usando il meccanismo JUST IN TIME!!!! MOLTO IMPORTANTE per capire...
			NOTA: recuperiamo fornitori di un prodotto sulla selezione del prodotto, il primo operatore da usare piu' corretto che sia switchMap() - se utente cambia velocemente
				la selezione, possiamo vedere fornitori di un'altro prodotto, se usiamo mergeMap!!!
				per capire meglio vedi il codice e i log nella console 
	confronto 	Get It All 					e  			Just in TIME
				- pattern dichiarativo					- codice piu' complesso
				- combina streams						- richiede utilizzo di higher order operators
				- ritardi iniziale, successivamente		- abbiamo il ritardo ogni volta che recuperiamo i dati di dettaglio 
				i dati si visualizzano all'istante
				- carico elevato sulla rete e server se - recupero dati effettivamente utili
				abbiamo tanti dati 
		NOTA: scegliere uno o l'altro in base alle specifiche e richieste del cliente 
	Stream ausiliari (aggiuntivi)
		e' semplicemente uno stream in piu' che definiamo per qualche info aggiuntiva (vedi commit con 'ancillary stream')
	combinare i stream
		per esempio la view del dettaglio prodotto per momento ha tre stream che usiamo con async pipe 
		possiamo combinare tutti gli stream in un unico 
		demo 
			usiamo operatore combineLatest
			ricordiamo che combineLatest imette un array dove ultimo item di ogni stream di input e' un elemento di questo array
			usiamo il filtro per verificare che e' stato selezionato il prodotto - NOTA: usiamo [] per la destrutturazione dell'array prendendo solo il primo elemento che e' il prodotto selezionato!!!
			alla fine usiamo map() per mappare array di tre elementi in un oggetto di tre proprieta' - e' piu' facile usare oggetto a livello della view
Recap
	NOTA: vedi key points - principali problemi che possiamo avere con rxjs!!!
	
	
	
	
	
	
	
	