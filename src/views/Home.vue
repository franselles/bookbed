<template>
  <div>
    <!-- MainMenu-Area -->
    <b-navbar toggleable="lg" type="dark" variant="info" fixed="top">
      <b-navbar-brand href="#">PLAYASBENIDORM.APP</b-navbar-brand>

      <b-navbar-toggle target="nav-collapse"></b-navbar-toggle>

      <b-collapse id="nav-collapse" is-nav>
        <b-navbar-nav>
          <b-nav-item href="#descarga">Descarga</b-nav-item>
          <b-nav-item href="#about_page">Playas Benidorm</b-nav-item>
          <b-nav-item href="#metodos">Métodos de pago</b-nav-item>
          <b-nav-item href="#como">Cómo funciona</b-nav-item>
        </b-navbar-nav>
      </b-collapse>
    </b-navbar>
    <!-- MainMenu-Area-End -->

    <!-- Home-Area -->
    <header class="home-area overlay" id="descarga">
      <div class="container">
        <div class="row">
          <div class="col-xs-12 hidden-sm col-md-5">
            <figure class="mobile-image wow fadeInUp" data-wow-delay="0.2s">
              <img src="images/header-mobile.png" alt="" />
            </figure>
          </div>
          <div class="col-xs-12 col-md-7">
            <div class="space-80 hidden-xs"></div>
            <img
              src="images/logo-solo-white.svg"
              data-wow-delay="0.4s"
              alt=""
              height="60"
              width="200"
            />
            <h1 class="wow fadeInUp" data-wow-delay="0.4s">Playas Benidorm</h1>
            <div class="space-20"></div>
            <div class="desc wow fadeInUp" data-wow-delay="0.6s">
              <p>
                Desde nuestra app podrás alquilar hamacas en las playas de
                Benidorm y Finestrat sin moverte de casa.
              </p>
            </div>
            <div class="space-20"></div>
            <a
              href="https://apps.apple.com/us/app/id1525546326"
              class="bttn-white sq wow fadeInUp"
              ><img src="images/apple-icon.png" alt="apple icon" /> Apple
              Store</a
            >
            <a href="#" class="bttn-white sq wow fadeInUp"
              ><img src="images/play-store-icon.png" alt="Play Store Icon" />
              Play Store</a
            >
          </div>
        </div>
      </div>
    </header>
    <!-- Home-Area-End -->
    <!-- About-Area -->
    <section class="section-padding" id="about_page">
      <div class="container">
        <div class="row">
          <div class="col-xs-12 col-md-10 col-md-offset-1">
            <div class="page-title text-center">
              <img src="images/logo-color.png" alt="About Logo" />
              <div class="space-20"></div>
              <h5 class="title">Playas Benidorm APP</h5>
              <div class="space-30"></div>
              <h3 class="blue-color">
                Reserva de forma sencilla y a través de tú smartphone las
                hamacas de nuestra empresa. Gestionamos la reserva de hamacas en
                las ciudades de Benidorm y Finestrat.
              </h3>
              <div class="space-20"></div>
              <p>
                De forma sencilla, podrás seleccionar el día, la ciudad y la
                zona donde disponemos de hamacas y realizar la reserva de una o
                varias hamacas así como complementos cómo las sombrillas.
                Disfruta de la un día perfecto tomando el sol.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
    <!-- About-Area-End -->
    <!-- Progress-Area -->
    <section class="progress-area gray-bg" id="metodos">
      <div class="container">
        <div class="row">
          <div class="col-xs-12 col-md-6">
            <div class="page-title section-padding">
              <h5 class="title wow fadeInUp" data-wow-delay="0.2s">
                Paga de forma sencilla
              </h5>
              <div class="space-10"></div>
              <h3 class="dark-color wow fadeInUp" data-wow-delay="0.4s">
                Abona tu pedido con tarjeta de crédito.
              </h3>
              <div class="space-20"></div>
              <div class="desc wow fadeInUp" data-wow-delay="0.6s">
                <p>
                  Utilizamos una pasarela segura de pago para tarjetas de
                  crédito.
                </p>
              </div>
              <div class="space-50"></div>
              <figure>
                <img src="images/tarjetas.png" alt="" />
              </figure>
            </div>
          </div>
          <div class="col-xs-12 col-md-6">
            <figure class="mobile-image">
              <img src="images/progress-phone.png" alt="" />
            </figure>
          </div>
        </div>
      </div>
    </section>
    <!-- Progress-Area-End -->

    <!-- How-To-Use -->
    <section class="section-padding" id="como">
      <div class="container">
        <div class="row">
          <div class="col-xs-12 col-sm-6">
            <div class="page-title">
              <h5 class="title wow fadeInUp" data-wow-delay="0.2s">
                ¿Cómo funciona?
              </h5>
              <div class="space-10"></div>
              <h3 class="dark-color wow fadeInUp" data-wow-delay="0.4s">
                Sistema simple y claro para realizar una reserva
              </h3>
            </div>
            <div class="space-20"></div>
            <div class="desc wow fadeInUp" data-wow-delay="0.6s">
              <p>
                Desde nuestra app podrás realizar la reserva de forma clara y
                sencilla en pocos pasos.
              </p>
            </div>
            <div class="space-50"></div>
          </div>
          <div class="col-xs-12 col-sm-6 col-md-5 col-md-offset-1">
            <div class="space-60 hidden visible-xs"></div>
            <div class="service-box wow fadeInUp" data-wow-delay="0.2s">
              <div class="box-icon">
                <i class="lnr lnr-calendar-full"></i>
              </div>
              <h4>Resserva</h4>
              <p>Realiza la reserva desde nuestra app</p>
            </div>
            <div class="space-50"></div>
            <div class="service-box wow fadeInUp" data-wow-delay="0.2s">
              <div class="box-icon">
                <i class="lnr lnr-cart"></i>
              </div>
              <h4>Paga</h4>
              <p>Abona el pedido con tus items</p>
            </div>
            <div class="space-50"></div>
            <div class="service-box wow fadeInUp" data-wow-delay="0.2s">
              <div class="box-icon">
                <i class="lnr lnr-tag"></i>
              </div>
              <h4>Muestra el Ticket</h4>
              <p>
                Muestras tus tickets del día desde la sección "Tickets del día"
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
    <!-- How-To-Use-End -->

    <!-- Footer-Bootom -->
    <div class="footer-bottom">
      <div class="container">
        <div class="row">
          <div class="col-xs-12 col-md-12 text-center">
            <span>Copyright &copy;Playas Benidorm</span>
            <div class="space-30 hidden visible-xs"></div>
            <br /><br />
            <a href="https://playasbenidorm.app/#/privacy"
              >Política de privacidad</a
            >
          </div>
        </div>
      </div>
    </div>
    <!-- Footer-Bootom-End -->
    <!-- Footer-Area-End -->
  </div>
</template>

<script>
export default {
  name: 'home',
};
</script>
