import React from 'react';

export default (slide) => [
  <div className="text-justify">
    <h3 className="display-3">Witaj!</h3>
    <p>
      Zapraszam serdecznie do wzięcia udziału w tej nietypowej, interaktywnej ankiecie, której celem jest
      zebranie subiektywnych opinii na temat rozwiązania pewnego problemu informatycznego.
    </p>
    <p>
      Ankieta jest nieodłączną częścią mojej <strong>pracy magisterskiej</strong>, zatytułowanej:
    </p>
    <blockquote>
      Przystosowanie webowych interfejsów użytkownika do wizualnej eksploracji wielkoskalowych danych
      pomiarowych.
    </blockquote>
    <p>
      Zalecam uważne zapoznanie się z materiałem wprowadzającym do zagadnienia oraz opisami poszczególnych wersji
      rozwiązania.
    </p>
  </div>,
  <div className="text-justify">
    <h3 className="display-3">Wprowadzenie
      <small> do zagadnienia</small>
    </h3>
    <p>
      Zagadnienie pochodzi z pogranicza czterech dziedzin: wizualnej eksploracji danych, Big Data, Aplikacji
      Internetowych oraz tzw. User Experience:
    </p>
    <ul>
      <li><em>Wizualnej eksploracji danych</em>, bo chodzi o umożliwienie przeglądania wykresów serii
        czasowych, na przykład pomiaru stężenia dwutlenku siarki na urządzeniu pomiarowym lub parametrów pracy serca
        chorego pacjenta.
      </li>
      <li><em>Big Data</em>, ponieważ danych do eksploracji jest napawdę wiele. Na tyle dużo, że ich przetworzenie
        stanowi wyzwanie technologiczne i analityczne.
      </li>
      <li><em>Aplikacji internetowych</em>, ponieważ wykresy te mają być prezentowane w przeglądarce użytkownika, która
        łączy się ze zdalnym serwerem poprzez sieć komputerową.
      </li>
      <li><em>User Experience</em>, czyli aspektu użyteczności i efektywności korzystania z interfejsu interaktywnego.
      </li>
    </ul>

  </div>,
  <div className="text-justify">
    <h3 className="display-3">Przypadek użycia </h3>
    <p>
      Wyobraź sobie, że pracujesz nad analizą zjawisk pogodowych w ostatnich kilkudzesięciu latach.
      Chcesz w swojej przeglądarce internetowej przeglądać, w postaci wykresu liniowego, dane pięciu parametrów z
      urządzenia pomiarowego: wilgotności, tempertatury, prędkości wiatru, stężenia dwutlenku węgla i ozonu.
    </p>
    <p>
      Załóżmy, że z punktu widzenia badawczego zasadne jest, aby brać pod uwagę ostatnie pięćdziesiąt lat pomiarów
      wykonywanych z częstotliwością co 10 sekund.
      Dodatkowo załóżmy, że w analize wartościowe jest zarówno przeglądanie większych zakresów danych by wysnuć
      generalne wnioski
      oraz przeglądanie poszczególnych incydentów.
    </p>
    <p>
      Policzmy, jak dużo danych potrzebnych jest do przetworzenia:
    </p>
    <pre>
        5 paramterów &times; 50 lat &times; 1/(10s) = 788.4 milionów punktów pomiarowych
    </pre>
    <p>
      Jeśli założyć, że każdy punkt wymaga zapisania daty powstania próbki oraz wartości pomiaru, to na zapisanie
      pojedynczego punktu potrzeba 12 bajtów (8 bajtów na datę w formacie <strong>long</strong> oraz 4 bajty na wartość
      w
      formacie
      zmiennoprzecinkowym).
    </p>
    <p>
      Biorąc pod uwagę liczbę punktów pomiarowych oraz rozmiar danych pojedycznego punktu,
      do przetworzenia jest aż <strong>9.5 GB danych</strong>
    </p>
    <p>
      Przy dobrym (100Mbps) łączu załadowanie tych danych do przeglądarki zajmie około <strong>13 minut</strong>.
      Nawet, jeśli każemy czekać użytkownikowi taki czas na pobranie tych danych z sieci do pamięci podręcznej
      komputera, to wyrysowanie miliarda punktów na wykresie niewątpliwie doprowadzi do awaryjnego zakończenia działania
      przeglądarki.
    </p>
  </div>,
  <div>
    <h3 className="display-3">Identyfikacja problemu</h3>
    <p>
      Być może zastanawiasz się, po co właściwie ładować te wszystkie dane? Przecież mózg ludzki nie jest w stanie
      przeanalizować każdego z miliarda punktów z osobna.
    </p>
    <p>
      Tutaj trzeba przywołać jeden istotny aspekt funkcjonalny zagadnienia.
      Otóż chcemy dać użytkownikowi swobodę nawigacji po wykresie, żeby mógł oglądać dane w
      dowolnym interesującym go zakresie i w odpowiednim przybliżeniu.
      Nawigacja ta powinna odbywać się w sposób <strong>płynny i nieograniczony</strong>, tak jak to ma miejsce w
      nowoczesnych systemach mapowych.
    </p>
    <p>
      Faktycznie, ze wspomnianych wcześniej względów nie jest możliwe zbudowanie aplikacji, która pobiera wszystkie dane
      na początku,
      i je wszystkie potem wyświetla. Wykreślenie milionów punktów też zajmuje sporą część mocy obliczeniowej komputera
      użykownika. Takie rozwiązanie po prostu się nie skaluje wraz ze wzrostem zbioru danych do przeglądania.
    </p>
  </div>,
  <div>
    <h3 className="display-3">Istniejące rozwiązania</h3>
    <p>
      Popularnym podejściem, które adresuje problem skalowalności, jest pobieranie z serwera tylko takiego zakresu
      danych, który ma być widoczny w danej chwili na ekranie.
    </p>
    <p>
      Ale co w momencie, gdy użytkownik chciałby obejrzeć z grubsza jakiś duży zakres czasu? A może chciałby zobaczyć
      wszystkie dane "z lotu ptaka"?
      W tej sytuacji problem pojawia się z powrotem - potrzeba załadować wszystkie dane do przeglądarki.
    </p>
    <p>
      Warto zauważyć, że ze względu na pikselową konstrukcję monitorów graficznych, liczba punktów potrzebnych do
      poprawnego wyrysowania fragmentu danych ograniczona jest w pewnym sensie liczbą pikseli wyświetlacza. Zresztą -
      rozdzielczść ludzkiego oka też jest ograniczona.
      W związku z powyższym - użytkownik i tak jest w stanie tylko obejrzeć pewną uproszczoną formę danych, nie do końca
      nawet zdając sobie z tego sprawę dzięki zdolności abstrackcji i generalizacji.

    </p>
    <p>
      Dla przykładu, jeżeli na typowym monitorze chcemy obejrzeć nasze dane zakresie jednego roku, to liczba puntów
      pomiarowych (około 3 miliony) znacznie przekracza liczbę pikseli w poziomie (około 2 tysiące).
      Zagęszczenie punktów na jednym rzędzie pikseli wyniesie kilka tysięcy.
      Takie zagęszczenie danych na ekranie jest zupełnie niepotrzebne, ze względu na wspomniane właśnie ograniczenia
      rozdzielczości
      monitora i ludzkiego oka.
    </p>
    <p>
      Te naturalne ograniczenie wykorzystuje się w optymalizacji wspomnianego wcześniej problemu.
      Otóż zakłada się, że oprócz tego, że z serwera są pobierane tylko potrzebne fragmenty danych, pobiera się je w
      formie maksymalnie uproszczonej. Nie za prostej, by nie było to zauważone przez ludzkie oko, ale takiej, by
      zminimalizować wielkość przesyłanych danych. Rozmiar ładowanych danych będzie więc bliski liczbie rzędów pikseli w
      poziomie &mdash; niezależnie od wielkości zakresu czasu.
    </p>
    <p>
      Takie podejście otwiera również nowe wyzwania, pojawiają się niestety też nowe problemy.
    </p>
  </div>,
  <div>
    <h3 className="display-3">Istniejące rozwiązania
      <small> &raquo; agregacje</small>
    </h3>
    <p>
      Aby stworzyć uproszczoną formę danych pomiarowych, wprowadza się pojęcie <strong>agregacji danych</strong>.
    </p>
    <p>
      W tym przypadku agragacja to pewna struktura danych opisująca generalne cechy grupy danych.
      Do obliczenia agregacji wykorzystuje się <em>agregaty</em> - funkcje matematyczne wyliczjące określoną statystykę.
      W tego typu systemach popularnymi agragatami są minimum, maksimum oraz wartość średnia.
    </p>
    <p>
      Przykład agregacji:
    </p>
    <blockquote>
      W sierpniu 2017 maksymalna temperatura wyniosła 33&deg;C, minimalna 15&deg;C, a średnia 21.34&deg;.
    </blockquote>
    <p>
      Jest to zbiór, który w prosty i zwięzły sposób opisuje najważniejsze ogólne cechy całego zbioru pomiarów
      dokonanych w sierpniu 2017.
    </p>
    <p>
      Tego typu agregacja jest uproszczoną formą danych. Nie oznacza to, że może być wykorzystana w dowolnym momencie.
      Najlepiej ją wykorzystać dla takieg skali wykresu, gdzie będzie ona mieściła się na jednym pionie pikselów ekranu.
      Gdy będzie większa - uproszczenie będzie już zauważalne dla ludzkiego oka.
    </p>
    <p>(obrazek)</p>
    <p>
      Podsumowując - popularne rozwiązanie minimalizuje komunikację między przeglądarką a serwerem, jadnak nie jest to
      zauważalne na wykresie.
    </p>
  </div>,
  <div>
    <h3 className="display-3">Istniejące rozwiązania
      <small> &raquo; serwer danych</small>
    </h3>
    <p>
      Warunkiem koniecznym tego rozwiązania jest, aby serwer na każde żądanie mógł odpowiedzieć w bardzo krótkim czasie.
      W tym celu serwer musi obliczyć agregacje (formy uproszczone), zanim zostanie o nie poproszony.
    </p>
    <p>
      Serwer danych trzyma w bazie specjalnie przygotowanej bazie dane oryginalne (generowane co 10s) (tutaj 9.5GB) oraz
      wyliczone agregacje
      o różnych wielkościach, na przykład
      <em> 30s</em>,
      <em> 1m</em>,
      <em> 3m</em>,
      <em> 10m</em>,
      <em> 30m</em>,
      <em> 1h</em>,
      <em> 4h</em>,
      <em> 8h</em>,
      <em> 12h</em>,
      <em> 1d</em>,
      <em> 7d</em>,
      <em> 30d</em>,
      <em> 90d</em>,
      <em> 1y</em>
      .
    </p>
    <p>(obrazek)</p>
    <p>
      Ważne jest, by tak dobrać wielkości agregacji, by dla każdego możliwego przybliżenia (skali) wykresu można było
      żądać dane o takiej wielkości agregacji, by odpowiadały blisko, lecz nie więcej niż jednemu pionu pikselów.
      Gdyby tak nie było, trzeba by było żądać mniejszych agregacji, co spowoduje niepotrzebnie zbyt dużą gęstość danych
      do wyświetlenia na ekranie.
    </p>
    <p>(obrazek - za dużo, za mało, w sam raz)</p>
  </div>,
  <div>
    <h3 className="display-3">Istniejące rozwiązania
      <small> &raquo; wyzwania</small>
    </h3>
    <p>
      Można więc uznać, że takie rozwiązanie w stu procentach rozwiązuje problem płynnej i nieograniczonej ekploracji
      wielkoskalowych danych pomiarowych w przeglądarce internetowej.
      Niestety, nie wzięliśmy pod uwagę jednego &mdash; ważnego czynnika &mdash; obecności sieci komputerowej.
    </p>
    <p>
      Skoro fragmenty danych ładowane sa na żądanie użytkownika, to będzie on zmuszony oczekiwać na te dane, zanim
      zostaną dostarczone przez sieć z serwera do przeglądarki.
      Nie będzie on w stanie płynnie eksplorować danych.
      Warto wspomnieć, że wg
      <a href="https://www.nngroup.com/articles/response-times-3-important-limits/" target="blank"> Nielsena</a>,
      oczekiwanie na odpowiedź systemu trwające powyżej 0.1 sekundy jest zauważalne i gdy się wydłuża &mdash; znacznie
      obniża się efektywność korzystania z systemu.
    </p>
    <p>
      To właśnie efektywności wizualnej eksploracji danych poświęcona jest moja praca, w ramach której zaproponowałem
      rozwiązanie, którego kolejne ulepszone wersje zostaną poddane subiektywnej ocenie w tej ankiecie.
    </p>
  </div>,
  <div>
    <h3 className="display-3">Proponowane rozwiązanie </h3>
    <p>
      Rozwiązanie ma na celu sprawienie, by użytkownik eksplorując dane nie doświadczał negatywnych skutków opóźnień
      sieci, żeby możliwie najlepiej ukryć przed nim fakt, że dane, które przegląda, zlokalizowane są na
      odległym serwerze.
      Dzięki temu użytkownicy dokonujący analizy wizualnej danych będą mogli jeszcze efektywniej wykonywać swoją pracę i
      ty samym zwiększyć satysfakcję z użytkowania całego systemu.
    </p>
    <p>
      Rozwiązanie zostało zaprojektowane w postaci uniwersalnego modułu (biblioteki) działającego w przeglądarce
      (język <em>JavaScript</em>), który łatwo integruje się z istniejącymi aplikacjami przeglądarkowymi, napisanymi
      również w języku JavaScript.
    </p>
    <p>
      Biblioteka ta, nosząca nazwę <em>"ExploreJS"</em>, zbudowana jest na czterech filarach:
    </p>
    <ul>
      <li>pamięć podręczna agregacji,</li>
      <li>projekcja pamięci podręcznej,</li>
      <li>mechanizmy predykcji,</li>
      <li>optymalizacja zapytań.</li>
    </ul>
    <p>
      W ankiecie zostaniesz poproszony o eksplorację przykładowych danych prezentowanych na interaktywnym wykresie
      liniowym. Wskazówki dotyczące używania zostaną zaprezentowane obok wykresu.
      Zostanie poddane ocenie pięć wersji rozwiązania. Pierwszym będzie tzw. rozwiązanie istniejące, później będą już
      rozwiązania ulepszone o kolejne filary.
      Twoim zadaniem będzie dokonać subiektywnej oceny satysfakcji użytkowania każdej wersji względem poprzedniej.
    </p>
  </div>
][slide]
