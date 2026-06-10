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
        md:max-w-full! md:w-full md:bg-primary-200 md:py-16
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
          Lidická sbírka umění
        </h1>
        <p>Vítejte v digitálním archivu Lidické sbírky umění (v Centrální evidenci sbírek uvedena jako podsbírka Sbírky Památníku, 15 - Výtvarného umění) zaujímá v kontextu evropských galerií a muzeí zcela výjimečné postavení. Tento unikátní soubor současného světového umění nevznikl tradiční sběratelskou činností, ale jako spontánní projev mezinárodní solidarity.</p>
      </BaseParagraph>
    </div>

    <BaseParagraph>
      <p>Lidická sbírka umění byla iniciována v roce 1966 výzvou sira Barnetta Strosse, předsedy hnutí „Lidice Shall Live“, na kterou reagovali umělci z celého světa. Darováním svých děl vyjádřili úctu obětem lidické tragédie a protest proti válce a násilí. Dnes tento fond, spravovaný jako sbírka muzejní povahy, zahrnuje díla významných českých i zahraničních autorů a představuje trvalý dialog mezi historií a současným uměním. Skrze tato díla Památník Lidice naplňuje své poslání uchovávat vzpomínku na tragédii a šířit myšlenky humanity.</p>
    </BaseParagraph>

    <BaseParagraph>
      <h2 class="text-heading-2">
        Vážíme si vašeho názoru
      </h2>
      <p>Tento online katalog spouštíme ve verzi Beta. Protože stále pracujeme na zdokonalování tohoto digitálního prostředí, jsou pro nás vaše postřehy nesmírně cenné. Pokud narazíte na jakékoli problémy nebo máte návrhy na zlepšení, napište nám prosím na e-mailovou adresu feedback-digi@lidice.art</p>
      <p>Děkujeme, že nám pomáháte zlepšovat způsob, jakým sdílíme tuto důležitou historii.</p>
    </BaseParagraph>

    <BaseParagraph>
      <h2 class="text-heading-2">
        Poděkování
      </h2>
      <p>Digitalizace sbírek Památníku Lidice je realizována díky finanční podpoře od Evropské unie prostřednictvím <strong>Národního plánu obnovy a Ministerstva kultury ČR</strong>. Tento web byl spolufinancován Ministerstvem kultury ČR.</p>
    </BaseParagraph>
  </div>
</template>

<script setup lang="ts">
import { BaseParagraph } from '@metafori/components';
</script>
