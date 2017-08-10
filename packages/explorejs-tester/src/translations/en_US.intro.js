import React from 'react';

export default (slide) => [
  <div className="text-justify">
    <h3 className="display-3">Hello!</h3>
    <p>
      I invite you to participate in this unusual interactive survey.
      The purpose of the survey is to gain subjective opinions about some software engineering problem.
    </p>
    <p>
      Ankieta jest nieodłączną częścią mojej <strong>pracy magisterskiej</strong>, zatytułowanej:
    </p>
    <blockquote>
      Adaptation of web-based user interfaces for visual exploration of measurement data at scale.
    </blockquote>
    <p>
      I highly encourage you to read carefully the introduction to the problem and to familiarize with descriptions of
      every version of given solution.
      This survey should take not longer than 15 minutes.
    </p>
  </div>,
  <div className="text-justify">
    <h3 className="display-3">Introduction
      <small> to the issue</small>
    </h3>
    <p>
      The problem touches four different computer engineering fields: visual exploration, Big Data, internet
      applications and User Experience:
    </p>
    <ul>
      <li><em>Visual exploration</em>because it's about browsing interactive time series charts, for example: density of
        <em>Sulphur dioxide</em> or sick patient heartbeats.
      </li>
      <li><em>Big Data</em> because the amount of data is so large that it's difficult in technical and analitycal
        manner.
      </li>
      <li><em>internet applications</em>, because the charts are presented on user's browser, which downloads data from
        web server through a computer network.
      </li>
      <li><em>User Experience</em>, the usability aspect and the performance of interactive interface.
      </li>
    </ul>

  </div>,
  <div className="text-justify">
    <h3 className="display-3">Use case </h3>
    <p>
      Imagine that you are working on the analysis of weather phenomena in the last few decades.
      You want to view five parameters from a measuring device: humidity, temperature, wind speed, carbon dioxide and
      ozone in your web browser, in the form of a line graph.
    </p>
    <p>
      Assume that from the research point of view it is reasonable to take into account the last fifty years of
      measurements performed every 10 seconds.
      In addition, let's assume that it is valuable to look at larger ranges to get general conclusions and smaller
      ranges to review individual incidents.
    </p>
    <p>
      Let's count how much data is to be processed:
    </p>
    <pre>
        5 parameters &times; 50 years &times; 1/(10s) = 788.4 million measurement data points
    </pre>
    <p>
      If we assume that each point needs to record the date of the sample and the measured value, then 12 bytes are
      required for writing a single point (8 bytes for the date in <strong>long</strong> format and 4 bytes for the
      floating point value).
    </p>
    <p>
      Given the number of points and the size of single point data, we need to process up to
      <strong>9.5 GB of data</strong>.
    </p>
    <p>
      With a good (100Mbps) connection, loading this data into your browser will take about <strong>13 minutes</strong>.
      Even if the user waits for such time to retrieve this data from the network into the computer's cache, drawing one
      billion points on the graph will undoubtedly crash the browser.
    </p>
  </div>,
  <div>
    <h3 className="display-3">Identify the problem</h3>
    <p>
      Perhaps you are wondering why we need to load all this data? After all, the human brain is not able to analyze
      each of the billions of points individually.
    </p>
    <p>
      Here we need to recall one important aspect of the problem.
      We want to give the user the freedom to navigate the graph so that he can see data of any range, at any zoom
      level.
      This navigation should be done in a <strong>fluent and unlimited way</strong>, as it does in modern mapping
      systems.
    </p>
    <p>
      Actually, for the aforementioned reasons it is not possible to build an application that gets all the data in the
      beginning, and then displays them.
      Drawing millions of points also takes up a large part of the user computer's computing power.
      This solution simply does not scale with increasing data size.
    </p>
  </div>,
  <div>
    <h3 className="display-3">Existing solutions</h3>
    <p>
      The popular approach that addresses the scalability problem is to retrieve only the amount of data from the server
      that is needed to be displayed on screen.
    </p>
    <p>
      You may be wondering what happens when the user wants to view data over a large time range.
      Or maybe he would like to see all the data "from the bird's eye view"?
      In this situation the problem reappears - you have to load all the data into the browser.
    </p>
    <p>
      It is worth to mentio that, due to the pixel structure of the graphic monitors, the number of points needed to
      display the data is limited in some sense by the number of pixels in the display.
      In fact, the resolution of the human eye is also limited.

      He is not even fully aware of this due to human abstraction and generalization abilities.

    </p>
    <p>
      Dla przykładu, jeżeli na typowym monitorze chcemy obejrzeć nasze dane w zakresie jednego roku, to liczba puntów
      pomiarowych (około 3 miliony) znacznie przekracza liczbę pikseli w poziomie (około 2 tysiące).
      Zagęszczenie punktów na jednym rzędzie pikseli wyniesie kilka tysięcy.
      Takie zagęszczenie danych na ekranie jest zupełnie niepotrzebne, ze względu na wspomniane właśnie ograniczenia
      rozdzielczości
      monitora i ludzkiego oka.
    </p>
    <p>
      To naturalne ograniczenie wykorzystuje się w optymalizacji wspomnianego wcześniej problemu.
      Otóż zakłada się, że oprócz tego, że z serwera są pobierane tylko chwilowo potrzebne fragmenty danych, pobiera się je w
      formie maksymalnie uproszczonej. Nie za prostej, by nie było to zauważone przez ludzkie oko, ale takiej, by
      zminimalizować wielkość przesyłanych danych. Rozmiar ładowanych danych będzie więc związany z liczbą rzędów pikseli w
      poziomie &mdash; tym samym niezależny od wielkości zakresu czasu.
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
      Najlepiej ją wykorzystać dla takiej skali wykresu, gdzie będzie ona mieściła się na jednym pionie pikselów ekranu.
      Gdy będzie większa - uproszczenie będzie już zauważalne dla ludzkiego oka.
    </p>
    <p>(obrazek)</p>
    <p>
      Podsumowując - popularne rozwiązanie minimalizuje komunikację między przeglądarką a serwerem, jednak nie jest to
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
      liniowym.
      Zostanie poddane ocenie pięć wersji rozwiązania. Pierwszym będzie tzw. rozwiązanie istniejące, później będą już
      rozwiązania ulepszone o kolejne filary.
      Twoim zadaniem będzie dokonać subiektywnej oceny satysfakcji użytkowania każdej wersji względem poprzedniej.
    </p>
  </div>
][slide]
