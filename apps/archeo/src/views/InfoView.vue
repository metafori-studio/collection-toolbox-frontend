<template>
  <div class="info mx-auto my-4 md:my-12 px-4 max-w-[680px] flex flex-col gap-10">
    <header class="flex flex-col gap-2">
      <span class="text-xs font-medium px-2 py-0.5 rounded w-fit bg-neutral-100 text-neutral-600">
        Skúšobná verzia
      </span>
      <h2 class="text-heading-2">
        {{ $t('info.title') }}
      </h2>
    </header>

    <div class="prose">
      <section>
        <h3>
          Čo je ArcheoMap
        </h3>
        <p>
          ArcheoMap.SAV.SK (ďalej ArcheoMap) je verejne dostupná aplikácia základných informácií o archeologických náleziskách, výskumoch, aktivitách i náhodných nálezoch na území Slovenska registrovaných v Archeologickom ústave Slovenskej akadémie vied, v. v. i. (ArÚ SAV) v Informačnom systéme Archeologického ústavu (ISAU), resp. v Centrálnej evidencii archeologických nálezísk na Slovensku (CEANS). Je výsledkom dlhoročnej práce ArÚ SAV, čiastkovo podporenej SAV, výskumnými projektmi a zdrojmi získanými podnikateľskou činnosťou pracoviska.
        </p>
        <p>
          Projekt ArcheoMap vznikol v ArÚ SAV v rámci združenia DARIAH-SK v rámci ESFRI s podporou Ministerstvo školstva, výskumu, vývoja a mládeže Slovenskej republiky a ďalších projektov.
        </p>
        <p>Zdroj dát: ISAU -Centrálna evidencia archeologických nálezov na Slovensku (CEANS), vedená v Archeologickom ústave SAV</p>
        <p>Dodávateľ technologickej platformy: OffGrid Lab, o. z.</p>
      </section>

      <section>
        <h3>
          Prečo ArcheoMap?
        </h3>
        <p>
          Slovensko je krajina s veľkou hustotou archeologických nálezísk. Ich zoznam bol doteraz zverejnený iba vo veľmi zjednodušenej podobe. Pre efektívny výskum a poznanie archeologického kultúrneho dedičstva a našej minulosti bude ArÚ SAV postupne sprístupňovať rôznorodé informácie zo svojich informačných systémov, najskôr o archeologických náleziskách a aktivitách (ISAU-CEANS) a neskôr i vybraných archeologických nálezoch (MUSEION). To pomôže okrem samotného výskumu aj prezentácii i ochrane kultúrneho dedičstva, ako aj špecializovanej štátnej správe i samospráve pri tvorbe územných plánov, príprave stavebnej činnosti, školám vo vzdelávaní a verejnosti v poznaní našej minulosti.
        </p>
      </section>

      <section>
        <h3>
          Zdroje údajov
        </h3>
        <p>
          V aplikácii sú využité zdroje spravované v Dokumentácii ArÚ SAV, inštitúcii, ktorá sa archeologickému výskumu cielene venuje od roku 1939. Pracovná skupina bude postupne údaje verifikovať, spracovávať a upravovať do požadovanej formy, následne zverejňovať. Bude sa postupovať podľa jednotlivých rokov, v ktorých sa informácia dostala do ArÚ SAV, od najnovších výskumov sa postupne doplnia staršie roky, až po rok 1939, kedy táto dokumentácia začala archivovať. V rámci možností sa v budúcnosti budeme snažiť dopĺňať aj informácie z publikácií, či iných zdrojov, či o encyklopedickú charakteristiku obcí a miest z pohľadu archeológie.
        </p>
        <p>
          Aplikácia obsahuje overené a spracované údaje o náleziskách, ktoré sú v dokumentácii ArÚ SAV a ktoré je ArÚSAV oprávnený zverejniť v zmysle platnej legislatívy. Nie je však úplná a vyčerpávajúca, nakoľko časť právnických osôb a objednávateľov záchranných výskumov, ktorí majú na základe zákona 49/2002 povinnosť odovzdávať výskumné dokumentácie Archeologickému ústavu SAV, si túto povinnosť neplní.
        </p>
      </section>

      <section>
        <h3>
          Terminológia a heslár
        </h3>
        <p>
          Aplikácia ArcheoMap vychádza z databázy ISAU-CEANS. Tá určuje aj použitú chronologickú a typologickú terminológiu a heslár. Chronologická terminológia vychádza z všeobecne akceptovaného posledného chronologického prehľadu praveku, včasnej doby dejinnej a stredoveku Slovenska, publikovaného v časopise Slovenská archeológia ***. Typizovaný heslár bol použitý aj pri základnej charakteristike lokality. Z informácií CEANS vychádza aj určenie presnosti polohy nálezu a náleziska. V prípade najnovších nálezov je možná presná lokalizácia. V prípade, že je určená iba opisná lokalizácia v rámci katastra obce, je táto lokalizácia určená ako približná. Ak nie je známa ani približná lokalizácia je poloha nálezu/náleziska je určená iba na kataster obce, je označená ako nepresná a bod je umiestnený približne na stred katastra.
        </p>
      </section>

      <section>
        <h3>
          Funkcie
        </h3>
        <p>
          Aplikácia ArcheoMap podáva základný prehľad o archeologických náleziskách v Slovenskej republike: polohe archeologického náleziska, jeho základnej charakteristike (druh náleziska) a časovom zaradení. Publikovaný je aj výber obrazovej dokumentácie (celkový plán, výber fotografickej dokumentácie a pod.). V metadátach sú aj odkazy na dokumentáciu, uloženú v dokumentačnom oddelení ArÚ SAV.
        </p>
        <p>
          K informáciám publikovaným v aplikácii je možné pristupovať rôznymi spôsobmi. „Preklikaním“ z mapy, na ktorej sú označené miesta archeologických aktivít a aj úroveň ich lokalizácie (presná, približná, nepresná v rámci katastra). Na postrannej lište je možné vyhľadávanie podľa zadaných jednotlivých kritérií a položiek, resp. podľa kombinácie viacerých kritérií (obec, kataster, časové určenie, kultúra, druh náleziska a pod.).
        </p>
        <p>
          Aplikácia má viacúrovňový systém prístupov, ktorý je podmienený registráciou. Čitatelia bez registrácie majú sprístupnené iba základné informácie o archeologických náleziskách, bez podrobnejších metadát.
        </p>
      </section>

      <section>
        <h3>
          Upozornenie!
        </h3>
        <p>
          Všetky fotografie a dokumenty v ArcheoMap podliehajú ochrane autorských a majetkových práv. Ich použitie je možné podľa podmienok licencie CC BY-NC 4.0. a platnej legislatívy. Akékoľvek iné použitie je možné iba po písomnej dohode so správcom majetkových práv.
        </p>
        <p>
          Fotografie, plány a kresby sú publikované v náhľadovom režime. Fotografie, plány a kresby v kvalitnejšom rozlíšení, si môže registrovaný užívateľ vyžiadať na študijné a vedecké účely priamo (majú aktivovanú funkciu „Objednať fotografiu“). Kópie dokumentov mu budú poskytnuté za úhradu nákladov v zmysle platného Cenníka za poskytnutie služieb a kópii dokumentov.
        </p>
        <p>
          Fotografie a obrázky, na ktoré majú autorské a majetkové práva iné inštitúcie, neposkytujeme.
        </p>
      </section>

      <section>
        <h3>
          Kontakt
        </h3>
        <p>
          Tento projekt sa neustále vyvíja. Ak máte otázky, návrhy na spoluprácu alebo pripomienky k aplikácii, napíšte nám na adresu: <a href="mailto:archeomap@savba.sk">archeomap@savba.sk</a>
        </p>
        <p class="text-neutral-6">
          ©Archeologický ústav SAV, v. v. i.. Všetky práva vyhradené.
        </p>
      </section>

      <section class="special-section">
        <h3>
          Informácie o súboroch cookies
        </h3>

        <h4>Čo sú cookies?</h4>
        <p>
          Cookies sú drobné textové súbory ukladané do vášho počítača. Ukladá ich internetový prehliadač na žiadosť jednotlivých webových stránok, ktoré si prezeráte. Webové stránky si môžu spätne vyžiadať obsah súboru. Podľa neho poznajú, ktoré stránky ste predtým navštívili, alebo či ste prihlásení. Cookies sú nutné pre správne fungovanie väčšiny webových stránok na internete.
        </p>

        <h4>Aké typy súborov používame?</h4>
        <p>
          Súbory cookies sa na tejto internetovej stránke delia podľa času platnosti alebo podľa účelu.
        </p>

        <h5>Platnosť</h5>
        <p>
          <strong>Krátkodobé cookies</strong> – platia počas vašej návštevy a niekoľko minút po opustení stránky strácajú platnosť. Pomáhajú základným funkciám našej stránky.
        </p>
        <p>
          <strong>Dlhodobé cookies</strong> – platia niekoľko dní až mesiacov. Uľahčujú nastavenie tejto stránky a pri návrate, pomáhajú s prihlásením alebo s pripomenutím ponuky.
        </p>

        <h5>Účel</h5>
        <p>
          <strong>Technické cookies</strong> – sú nevyhnutné pre správne fungovanie webu a všetkých funkcií, ktoré ponúka. Tieto súbory zaisťujú zobrazovanie zoznamu obľúbených dát, správne fungovanie filtrov alebo prihlásenia. Bez týchto súborov cookies nebude webová stránka správne fungovať. V predvolenom nastavení sú povolené a nie je možné ich zakázať. Tieto súbory cookies neukladajú žiadne osobne identifikovateľné informácie.
        </p>
        <p>
          <strong>Analytické cookies</strong> – nám umožňujú merať výkon nášho webu. Pomocou nich určujeme počet návštev a zdroje návštev našich internetových stránok. Dáta získané prostredníctvom týchto cookies spracovávame súhrne, bez použitia identifikátorov, ktoré ukazujú na konkrétnych používateľov nášho webu. Ak vypnete používanie analytických cookies vo vašom prehliadači, strácame možnosť analýzy výkonu a následnej optimalizácie nášho webu.
        </p>
        <p>Naša webová stránka neobsahuje marketingové, personalizované a reklamné cookies</p>

        <h4>Nastavenie cookies</h4>
        <p>
          Cookies si môžete nastaviť vo svojom prehliadači.
        </p>

        <h4>Komu cookies poskytujeme?</h4>
        <p>
          Cookies slúžia okrem iného na prispôsobenie tejto webovej aplikácie. Za týmto účelom umožňujeme uložiť cookies tretím stranám, ktoré ich môžu použiť na zber údajov o vašom správaní na našom webe.
        </p>

        <h4>Doba spracovania cookies</h4>
        <p>
          Čas spracovania jednotlivých typov cookies, resp. ich exspirácie sa líši a v čase sa mení. Nájdete ho v nastavení vášho prehliadača.
        </p>

        <h4>Práva subjektu údajov</h4>
        <p>
          Máte právo obrátiť sa na nás so žiadosťou o oznámenie podrobností v súvislosti so spracovaním osobných údajov a my vám bezplatne poskytneme podrobné informácie. Musíme vás ale upozorniť, že v prípade opakovaných, alebo neodôvodnených žiadostí, sme oprávnení žiadať za poskytnutie informácii úhradu nákladov s tým spojených alebo poskytnutie informácie odoprieť.
        </p>
        <p>Môžete sa na nás obrátiť so žiadosťou o výmaz osobných údajov.</p>
        <p>
          Smiete vzniesť námietku proti spracovaniu osobných údajov a môžete sa tiež obrátiť na Úrad pre ochranu osobných údajov, ak máte za to, že naša spoločnosť spracováva osobné údaje protiprávne.
        </p>
      </section>

      <section class="special-section">
        <h3>
          Zásady ochrany osobných údajov
        </h3>

        <p>Informácie o spracúvaní osobných údajov</p>

        <h4>Identifikačné údaje prevádzkovateľa a zodpovednej osoby</h4>
        <p>
          Prevádzkovateľom osobných údajov je: Archeologický ústav SAV, v. v. i. (ďalej ArÚ SAV), so sídlom Akademická 2, 949 21 Nitra, IČO 00166723, ktorá spracúva osobné údaje za podmienok uvedených nižšie. ArÚ SAV vymenoval za svojho zodpovedného zástupcu PhDr. Peter Bednár, CSc. , e-mailová adresa: <a href="mailto:peter.bednar@savba.sk">peter.bednar@savba.sk</a>.
        </p>
        <p>Príjemcami osobných údajov sú nasledovné osoby:</p>
        <p>
          ArÚ SAV, prevádzkovateľ internetovej stránky <a href="https://www.archeomap.sav.sk">www.archeomap.sav.sk</a>, poskytovatelia služieb profilovania webovej aplikácie, zmluvní partneri zabezpečujúci IT systémy.
        </p>
        <p>
          Právnym základom spracúvania osobných údajov je článok 6 ods. 1 písm. b) Nariadenia GDPR. Spracúvanie osobných údajov je nevyhnutné pre korektné využitie webovej stránky a údajov z nej.
        </p>
        <p>
          ArÚ SAV spracúva nasledovné osobné údaje registrovaného účastníka: meno, priezvisko, telefónne číslo, e-mailová adresa, adresa a história prehliadania.
        </p>
        <p>
          Osobné údaje sú spracúvané počas obdobia využívania webovej aplikácie zo strany užívateľa Po zrušení registraácie sa vymazávajú.
        </p>

        <h4>Registrácia</h4>
        <p>
          ArÚ SAV spracúva na účely registrácie a prevádzky webu nasledovné osobné údaje: meno, priezvisko, telefónne číslo, e-mailová adresa, adresa a história prehliadania.
        </p>

        <h4>Pripomienky a návrhy k prevádzke aplikácie.</h4>
        <p>
          Pripomienky a návrhy môže zasielať iba registrovaný používateľ, ktorý aplikáciu využíva, a to na mailovú adresu: <a href="mailto:archeomap@savba.sk">archeomap@savba.sk</a>
        </p>
        <p>
          Každá pripomienka je skontrolovaná administrátorom. Ak obsahuje relevantné overiteľné informácie, ktoré je možné publikovať, môže byť použitá pri úprave dát na stránke.
        </p>

        <p>Registrovaný užívateľ má voči prevádzkovateľovi právo:</p>
        <ol>
          <li>požadovať prístup k jeho osobným údajom;</li>
          <li>na opravu svojich osobných údajov;</li>
          <li>na vymazanie svojich osobných údajov;</li>
          <li>na obmedzenie spracúvania svojich osobných údajov;</li>
          <li>právo na prenosnosť osobných údajov a</li>
          <li>právo namietať proti spracúvaniu osobných údajov.</li>
        </ol>
        <p>Tieto práva si dotknutá osoba môže uplatniť kontaktovaním administrátora stránky:</p>
        <ol>
          <li>
            písomne zaslaním listu na adresu ArÚ SAV s uvedením mena a priezviska zodpovednej osoby ArÚ SAV,
          </li>
          <li>
            elektronicky zaslaním e-mailu na adresu <a href="mailto:archeomap@savba.sk">archeomap@savba.sk</a>.
          </li>
        </ol>

        <h4>Príslušné právne predpisy</h4>
        <p>
          Príslušným právnym predpisom je najmä Nariadenie GDPR, aplikovateľný zákon o ochrane osobných údajov v účinnom znení a ostatné aplikovateľné všeobecne záväzné právne predpisy.
        </p>
      </section>

      <p class="text-neutral-500">
        Peter Bednár, Elena Blažová, Matej Ruttkay
      </p>
    </div>
  </div>
</template>

<style scoped>
@reference "../style/main.css";

.prose {
  @apply flex flex-col gap-8;

  & h3 {
    @apply text-heading-3 font-bold;
  }

  & h4 {
    @apply text-heading-4 font-bold mt-4;
  }

  & h5 {
    @apply font-bold pl-8;
  }

  & section {
    @apply flex flex-col gap-2;
  }

  & .special-section {
    @apply bg-neutral-100 rounded-md p-6;
  }

  & ul,
  & ol {
    @apply flex flex-col gap-2 pl-8;
  }

  & ul {
    @apply list-disc;
  }

  & ol {
    @apply list-[lower-alpha];
  }

  & a {
    @apply underline;
  }
}

</style>
