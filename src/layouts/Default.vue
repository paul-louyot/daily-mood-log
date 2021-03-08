<template>
  <div class="layout">
    <header class="header">
      <b-container>
        <b-row style="margin-top: 20px" class="mb-3">
          <b-col cols="12" class="d-flex align-items-center justify-content-between">
            <g-link to="/">
              <h1 class="m-0">Daily mood log</h1>
            </g-link>
            <g-link class="nav__link" to="/about/">F.A.Q</g-link>
          </b-col>
        </b-row>
      </b-container>
    </header>
    <slot/>
  </div>
</template>

<static-query>
query {
  metadata {
    siteName
  }
}
</static-query>

<script>
export default {
  mounted(){
    if(!sessionStorage.getItem("_swa")&&document.referrer.indexOf(location.protocol+"//"+location.host)!== 0){fetch("https://counter.dev/track?"+new URLSearchParams({referrer:document.referrer,screen:screen.width+"x"+screen.height,user:"pi_el_59",utcoffset:"1"}))};sessionStorage.setItem("_swa","1");
  }
}
</script>

<style>
body {
  font-family: -apple-system,system-ui,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Arial,sans-serif;
  margin:0;
  padding:0;
  line-height: 1.5;
}

.layout {
  max-width: 760px;
  margin: 0 auto;
  padding-left: 20px;
  padding-right: 20px;
}

@media (max-width: 575.98px) {
  h1 {
    font-size: 18px;
  }
}
</style>
