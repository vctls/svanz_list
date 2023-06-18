<script lang="ts">
  // @ts-check
  import QRCode from "./qrcode";
  let svg = '</br>'
  if (window.location.protocol === 'https:') {
    svg = new QRCode(window.location.href).svg(); 
  }
</script>

{@html svg}