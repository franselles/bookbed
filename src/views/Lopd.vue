<template>
  <div>
    <nav class="breadcrumb" aria-label="breadcrumbs">
      <ul>
        <li>
          <a href="#" @click="back"
            ><b-icon icon="arrow-left-thick"></b-icon> VOLVER</a
          >
        </li>
      </ul>
    </nav>
    <p>
      LA (VUESTRA EMPRESA) está especialmente sensibilizada en la protección de
      los datos de los USUARIOS de los servicios a los que se accede a través de
      su web. Mediante la presente Política de Privacidad (en adelante , la
      Política) LA (VUESTRA EMPRESA) informa a los USUARIOS del sitio web:
      (VUESTROS DATOS)del tratamiento y usos a los que se someten los datos de
      carácter personal que se recaban en la web, con el fin de que decidan,
      libre y voluntariamente, si desean facilitar la información solicitada.
    </p>

    <p>
      LA (VUESTRA EMPRESA) se reserva la facultad de modificar esta Política con
      el objeto de adaptarla a novedades legislativas, criterios
      jurisprudenciales, prácticas del sector, o intereses de la entidad.
      Cualquier modificación en la misma será anunciada con la debida
      antelación, a fin de que tengas perfecto conocimiento de su contenido.
    </p>

    <p>
      Ciertos servicios prestados en el portal pueden contener condiciones
      particulares con previsiones en materia de protección de Datos Personales.
      De ellos puedes informarte en los correspondientes apartados.
    </p>

    <p>
      TITULARIDAD DEL TRATAMIENTO En dichos supuestos, los datos recabados por
      LA (VUESTRA EMPRESA) serán incorporados a ficheros titularidad de LA
      (VUESTRA EMPRESA) , debidamente inscritos en el Registro General de
      Protección de Datos.
    </p>

    <p>
      USOS Y FINALIDADES La finalidad de la recogida y tratamiento de los datos
      personales es la gestión, prestación y personalización de los servicios y
      contenidos del mismo que el USUARIO utilice y de la cual se informará en
      cada apartado.
    </p>

    <p>
      COMUNICACIÓN DE LOS DATOS Los datos recabados a través de la web sólo
      serán cedidos en aquellos casos en que expresamente se informe de ello al
      USUARIO.
    </p>

    <p>
      ACTUALIZACIÓN DE LOS DATOS Con el fin de que los datos obrantes en
      nuestras bases de datos siempre correspondan a tu situación real deberás
      mantenerlos actualizados, bien actualizándolos tú directamente en los caso
      en que ello sea posible bien comunicándolo al departamento
      correspondiente.
    </p>

    <p>
      UTILIZACIÓN DE COOKIES Con el objeto de proteger la intimidad de los
      usuarios de su página web LA (VUESTRA EMPRESA) no emplea cookies cuando
      los mismos navegan por la misma.
    </p>

    <p>
      SEGURIDAD DE LOS DATOS LA (VUESTRA EMPRESA) ha adoptado en su sistema de
      información las medidas técnicas y organizativas legalmente requeridas, a
      fin de garantizar la seguridad y confidencialidad de los datos
      almacenados, evitando así, en la medida de lo posible, su alteración,
      pérdida, tratamiento o acceso no autorizado.
    </p>

    <p>
      DERECHOS DE LOS USUARIOS En todo caso podrás acceder a tus datos,
      rectificarlos, cancelarlos y en su caso, oponerte a su tratamiento: a)
      bien mediante solicitud acompañada de una fotocopia de tu D.N.I., remitida
      a la siguiente dirección postal: LA (VUESTRA EMPRESA) . X(VUESTROS
      DATOS)X, C.P. X (VUESTROS DATOS)X - X(VUESTROS DATOS)X b) bien mandando un
      e-mail a la siguiente dirección de correo electrónico: X(VUESTROS DATOS)X
    </p>
    <b-button type="is-success" @click="back">VOLVER</b-button>
  </div>
</template>

<script>
export default {
  name: 'lopd',
  methods: {
    back() {
      this.$router.go(-1);
    },
  },
};
</script>

<style scoped></style>
