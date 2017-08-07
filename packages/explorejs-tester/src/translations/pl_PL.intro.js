import React from 'react';

export default (slide) => [
  <div className="text-justify">
    <h3 className="display-3">Witaj!</h3>
    {/*<p className="lead">*/}
    <p>
      Zapraszam serdecznie do wzięcia udziału w tej nietypowej, interaktywnej ankiecie.
      Jest ona nieodłączoną częścią mojej <strong>pracy magisterskiej</strong>, zatytułowanej:
    </p>
    <blockquote>
      Przystosowanie webowych interfejsów użytkownika do interaktywnej wizualnej eksploracji wielkoskalowych danych
      pomiarowych.
    </blockquote>
    <p>
      Celem ankiety jest zebranie subiektywnych opinii na temat rozwiązania pewnego problemu informatycznego.
      Bardzo zalecam uważne zapoznanie się z materiałem wprowadzającym do zagadnienia oraz opisami poszczególnych wersji
      rozwiązania.
    </p>
    {/*<hr className="my-3"/>*/}

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
      <li><em>Interaktywnej wizualnej eksploracji danych</em>, bo chodzi o umożliwienie przeglądania wykresów serii
        czasowych, na przykład pomiaru stężenia dwutlenku siarki na urządzeniu pomiarowym lub parametrów pracy serca
        chorego pacjenta.
      </li>
      <li><em>Big Data</em>, ponieważ danych do eksploracji jest napawdę wiele. Zbyt wiele, by można było wyciągnąć z
        tych danych pożyteczne informacje bez automatycznego ich przetwarzania.
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
      Wyobraź sobie, że pracujesz nad analizą znawisk pogodowych w ostatnich kilkudzesięciu latach.
      Chcesz w swojej przeglądarce internetowej przeglądać, w postaci wykresu liniowego, dane pięciu parametrów z
      urządzenia pomiarowego: wilgotności, tempertatury, prędkości wiatru, stężenia dwutlenku węgla i ozonu.
    </p>
    <p>
      Załóżmy, że z punktu widzenia badawczego zasadne jest, aby brać pod uwagę ostatnie pięćdziesiąt lat pomiarów
      wykonywanych z częstotliwością co 10 sekund.
      Dodatkowo załóżmy, że w analize wartościowe jest zarówno przeglądanie większych zakresów danych by wysnuć
      generalne wnioski
      oraz prezglądanie poszczególnych incydentów.
    </p>
    <p>
      Policzmy, jak dużo danych potrzebnych jest do przetworzenia:
    </p>
    <pre>
        5 paramterów &times; 50 lat &times; 1/10s = 788.4 milionów punktów pomiarowych
    </pre>
    <p>
      Jeśli założyć, że każdy punkt wymaga zapisania daty powstania próbki oraz wartość pomiaru, to na zapisanie
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
      przeanalizować każdy z miliarda punktów z osobna.
    </p>
    <p>
      Tutaj trzeba przywołać jeden istotny aspekt funkcjonalny zagadnienia.
      Problem polega na tym, że chcemy dać użytkownikowi swobodę nawigacji po wykresie, żeby mógł oglądać dane w
      interesującym go zakresie i w odpowiednim przybliżeniu.
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
      Popularnym podejściem, które adresuje problem skalowalności, jest pobieranie tylko tych danych, które są niezbędne
      do poprawnego wyrysowania wykresu w żądanym zakresie czasu, w danym momencie.
    </p>
    <p>
      Ale co w momencie, gdy użytkownik chciałby obejrzeć z grubsza jakiś duży zakres czasu? A może chciałby zobaczyć
      wszystkie "z lotu ptaka"?
      Warto zauważyć, że ze względu na pikselową konstrukcję monitorów graficznych, liczba punktów potrzebnych do
      poprawnego wyrysowania fragmentu danych ograniczona jest w pewnym sensie liczbą pikseli. Zresztą -
      rozdzielczść ludzkiego oka też jest ograniczona.
      W związku z powyższym - użytkownik i tak jest w stanie tylko obejrzeć pewną uproszczoną formę danych, nie do końca
      nawet zdając sobie z tego sprawę.

    </p>
    <p>
      Dla przykładu, jeżeli na typowym monitorze chcemy obejrzeć nasze dane zakresie jednego roku, to liczba puntów
      pomiarowych (około 3 miliony) znacznie przekracza liczbę pikseli w poziomie (kilka tysięcy).
      Zagęszczenie punktów na jednym rzędzie pikseli wyniesie również kilka tysięcy.
    </p>
    <p>
      Takie zagęszczenie jest zupełnie niepotrzebne, a założenie, że z serwera pobierane były by maksymalnie uproszczone
      formy, na tyle proste by minimalizować wielkość przesyłanych dany przy jednoczesnym nie pogarszaniu obrazu danych.
      Takie podejście otwiera również nowe wyzwania, pojawiają się niestety też inne problemy.
    </p>
  </div>,
  <div>
    W ankiecie zostaniesz poproszony o eksplorację pewnych danych za pomocą wykresu liniowego.
    Jest pięć różnych wersji rozwiązania, począwszy od sytuacji wyjściowej do problemu, kończywszy na najbardziej
    złożonym rozwiązaniu.
    Twoim zadaniem będzie dokonać subiektywnej oceny satysfakcji użytkowania każdej wersji względemj poprzedniej.
  </div>
][slide]
