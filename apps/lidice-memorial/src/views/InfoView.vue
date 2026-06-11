<template>
  <div
    class="
      text-lg py-6 md:pt-0 md:pb-16
      flex flex-col items-center gap-10 md:gap-16
      [&>*]:max-w-[832px] [&>*]:px-4
    "
  >
    <div
      class="
        md:max-w-full! md:w-full md:bg-primary-500 md:text-white md:py-16
        flex flex-col items-center gap-4 md:gap-10
      "
    >
      <img
        class="w-full max-w-[1000px]"
        src="https://fastly.picsum.photos/id/399/1000/500.jpg?hmac=SQTwqkg3qogIW3wOwwn01t8zlMGGuZLt_UPtq4Q_DW8"
        alt=""
      >

      <BaseParagraph class="max-w-[800px] text-xl md:gap-10">
        <h1 class="text-heading-1">
          Sbírky Památníku Lidice
        </h1>
        <p>
          Vítejte v digitálním archivu Památníku Lidice. Jsme národní paměťová instituce pečující o trvalé uchování vzpomínky na vyhlazení obce Lidice a osady Ležáky a utrpení jejich občanů, kteří se stali obětmi nacistického násilí. Tento portál zpřístupňuje naše fondy široké veřejnosti a badatelům. Naplňujeme tím své poslání uchovat jméno Lidic jako celosvětový symbol nevinných obětí a jméno Ležáků coby symbol hrdinného protinacistického odboje.
        </p>
      </BaseParagraph>
    </div>

    <BaseParagraph>
      <p>Jádrem Sbírky Památníku Lidice, zapsané v Centrální evidenci sbírek, jsou rozsáhlé podsbírky Historická (v CES uvedena jako 10 – Historická) a Fotografická (21 - Fotografie, filmy, videozáznamy a jiná média). Tyto materiály, od dobových fotografií a dokumentů až po osobní předměty a archeologické nálezy přímo z místa tragédie, vyprávějí autentické příběhy obyvatel starých Lidic, dokumentují lidickou tragédii a jsou nenahraditelným svědectvím o životě obce a jejím poválečném odkazu. Menší sbírkový fond představuje podsbírka Ležáky (25 - NKP Ležáky) tvořená zejména fotografiemi s potenciálem pro budoucí růst.</p>
      <p> Nedílnou součástí našich fondů, o které pečujeme ve smyslu zákona o ochraně sbírek muzejní povahy, je Lidická sbírka umění (podsbírka 15 - Výtvarného umění). Tento jedinečný soubor současného umění vznikl z darů umělců z celého světa jako gesto trvalé mezinárodní solidarity. Lidická sbírka umění je jednou z mála solidárních sbírek na světě a ve svém nitru pečuje o nejvýznamnější díla současného umění na našem území.</p>
    </BaseParagraph>

    <BaseParagraph>
      <h2 class="text-heading-2">
        Vážíme si vašeho názoru
      </h2>
      <p>
        Tento online katalog spouštíme ve verzi Beta. Protože stále pracujeme na zdokonalování tohoto digitálního prostředí, jsou pro nás vaše postřehy nesmírně cenné. Pokud narazíte na jakékoli problémy nebo máte návrhy na zlepšení, napište nám prosím na e-mailovou adresu
        <a
          href="mailto:feedback-digitalizace@lidice-memorial.cz"
          class="underline"
        >
          feedback-digitalizace@lidice-memorial.cz
        </a>
      </p>
      <p>Děkujeme, že nám pomáháte zlepšovat způsob, jakým sdílíme tuto důležitou historii.</p>
    </BaseParagraph>

    <BaseParagraph>
      <h2 class="text-heading-2">
        Poděkování
      </h2>
      <p>Digitalizace sbírek Památníku Lidice je realizována díky finanční podpoře od <strong>Evropské unie</strong> prostřednictvím <strong>Národního plánu obnovy a Ministerstva kultury ČR</strong>. Tento web byl spolufinancován <strong>Ministerstvem kultury ČR</strong>. </p>
    </BaseParagraph>
  </div>
</template>

<script setup lang="ts">
import { BaseParagraph } from '@metafori/components';
</script>
