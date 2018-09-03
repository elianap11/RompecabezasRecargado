//Bottom up

var Juego = {

  //Inicio, cargo y configuro la imagen con canvas

  iniciarImagen: function (callback) {
    this.imagen = new Image();
    var self = this;
    this.imagen.addEventListener('load', function () {
      self.cargarImagen.call(self);
      callback();
    }, false);
    this.imagen.src = "images/mdn.png";
  },

  cargarImagen: function (e) {    
    this.anchoPiezas = Math.floor(600 / this.cantidadDePiezasPorLado);
    this.altoPiezas = Math.floor(600 / this.cantidadDePiezasPorLado);
    this.anchoDeRompecabezas = this.anchoPiezas * this.cantidadDePiezasPorLado;
    this.altoDeRompecabezas = this.altoPiezas * this.cantidadDePiezasPorLado;
    this.configurarCanvas();
  },

  configurarCanvas: function(){
    this.canvas = document.getElementById("micanvas");
    this.contexto = this.canvas.getContext("2d");
    this.canvas.width = this.anchoDeRompecabezas;
    this.canvas.height = this.altoDeRompecabezas;
    this.contexto.drawImage(this.imagen, 0, 0, this.anchoDeRompecabezas, this.altoDeRompecabezas);
  },

  //creo una grilla genérica para que el usuario elija la cantidad de piezas según el nivel
  crearGrilla: function(){
    this.grilla = []
    for(var i=0; i<this.cantidadDePiezasPorLado; i++ ){
      this.grilla.push([]);
    }
    for(var i=1; i<=this.cantidadDePiezasPorLado; i++ ){
      for(var j=0; j<this.cantidadDePiezasPorLado; j++ ){
        this.grilla[j].push(i + this.cantidadDePiezasPorLado * j);
      }
    }
  },

  crearPiezas: function(){
    this.piezas = [];
    for (var i = 0; i < this.cantidadDePiezasPorLado; i++){
      this.piezas[i] = [];
      for(var j = 0; j < this.cantidadDePiezasPorLado; j++){
        this.piezas[i][j] = [];
        this.piezas[i][j].x = i;
        this.piezas[i][j].y = j;
      }
    }
  },

  construirPiezas: function(){
    for (i = 0; i < this.cantidadDePiezasPorLado; i++){
      for(j = 0; j < this.cantidadDePiezasPorLado; j++){
        var x = this.piezas[i][j].x;
        var y = this.piezas[i][j].y;
        this.contexto.drawImage(this.imagen, x * this.anchoPiezas, y * this.altoPiezas, 
                                this.anchoPiezas, this.altoPiezas, i * this.anchoPiezas, 
                                j * this.altoPiezas, this.anchoPiezas, this.altoPiezas);
      }
    }
  },

  intercambiarPosiciones: function(filaPos1, columnaPos1, filaPos2, columnaPos2){
    var posicion1 = this.grilla[filaPos1][columnaPos1];
    var posicion2 = this.grilla[filaPos2][columnaPos2];
    this.grilla[filaPos1][columnaPos1] = posicion2;
    this.grilla[filaPos2][columnaPos2] = posicion1;

    var temporal = [];
    temporal = this.piezas[filaPos1][columnaPos1];
    this.piezas[filaPos1][columnaPos1] = this.piezas[filaPos2][columnaPos2];
    this.piezas[filaPos2][columnaPos2] = temporal;

    this.construirPiezas();
    this.piezaVacia(filaPos2, columnaPos2);
  },
  
  chequearSiGano: function(){
    var posicionInicial = 1;
    for (var i = 0; i < this.grilla.length; i++) {
      for (var j = 0; j < this.grilla.length; j++) {
        if (this.grilla[i][j] === posicionInicial) {
          posicionInicial++;
        }
      }
    }
    posicionInicial === Math.pow(this.cantidadDePiezasPorLado, 2) + 1 ?
    this.mostrarCartelGanador() : this.restarMovimientos();
  },

  mostrarCartelGanador: function(){
    swal("¡Lo lograste! Has ganado el juego.", "Felicitaciones", "success",)
  },

  mostrarCartelPerdedor: function(){
    swal('¡Fallaste! Has perdido', 'Vuelve a intentar', 'error')
  },

  restarMovimientos: function(){
    if(document.getElementById("contadorDeMovimientos").innerHTML > 1 ) {
      document.getElementById("contadorDeMovimientos").innerHTML--;
    }else{
      document.getElementById("contadorDeMovimientos").innerHTML = 0;
      this.mostrarCartelPerdedor();
    }
  },

  //dibujo la pieza blanca
  piezaVacia: function(filaBlanca, columnaBlanca){
    this.contexto.beginPath();
    this.contexto.rect(filaBlanca * this.anchoPiezas, columnaBlanca * this.altoPiezas, 
                      this.altoPiezas, this.anchoPiezas);
    this.contexto.fillStyle = '#FFFFFF';
    this.contexto.fill();
  },

  actualizarPosicionVacia: function(nuevaFila,nuevaColumna){
    this.filaVacia = nuevaFila;
    this.columnaVacia = nuevaColumna;
  },

  posicionValida: function(fila, columna){
    return(fila >= 0 && fila < this.cantidadDePiezasPorLado) && (columna >= 0 && columna < this.cantidadDePiezasPorLado)
  },

  moverEnDireccion: function(direccion){
    var nuevaFilaVacia;
    var nuevaColumnaVacia;

    if(direccion == 40){
      nuevaFilaVacia = this.filaVacia;
      nuevaColumnaVacia = this.columnaVacia+1;
    }
    else if (direccion == 38) {
      nuevaFilaVacia = this.filaVacia;
      nuevaColumnaVacia = this.columnaVacia-1;
    }
    else if (direccion == 39) {
      nuevaFilaVacia = this.filaVacia+1;
      nuevaColumnaVacia = this.columnaVacia;
    }    
    else if (direccion == 37) {    
      nuevaFilaVacia = this.filaVacia-1;
      nuevaColumnaVacia = this.columnaVacia;
    }

    if (this.posicionValida(nuevaFilaVacia, nuevaColumnaVacia)){
      this.intercambiarPosiciones(this.filaVacia, this.columnaVacia,
      nuevaFilaVacia, nuevaColumnaVacia);
      this.actualizarPosicionVacia(nuevaFilaVacia, nuevaColumnaVacia);
    }
  },

  capturarTeclas: function(){
    var self = this;
    document.body.onkeydown = (function(evento) {
      if(evento.which == 40 || evento.which == 38 || evento.which == 39 || evento.which == 37){
        self.moverEnDireccion(evento.which);
        var gano = self.chequearSiGano();
        if(gano){
          setTimeout(function(){
            self.mostrarCartelGanador();
          },50);
        }
        evento.preventDefault();
      }
    });
  },

  elegirNivel: function(){    
    var valor = $("input:checked").val()
    var self = this;

    $("#facil").on( "click", function() {
      valor = 4
      this.cantidadDePiezasPorLado = valor
      document.getElementById('cantidadPiezasPorLado').textContent = valor
      document.getElementById('contadorDeMovimientos').textContent = 50
      self.iniciar()
    });                 
    $("#intermedio").on( "click", function() {
      valor = 6
      this.cantidadDePiezasPorLado = valor
      document.getElementById('cantidadPiezasPorLado').textContent = valor
      document.getElementById('contadorDeMovimientos').textContent = 70
      self.iniciar()
    });
    $("#dificil").on( "click", function() {
      valor = 8
      this.cantidadDePiezasPorLado = valor
      document.getElementById('cantidadPiezasPorLado').textContent = valor
      document.getElementById('contadorDeMovimientos').textContent = 90
      self.iniciar()
    });
  },

    //capturo el evento del click en canvas cuando hago click y tomo la posición
    piezasClick: function(){
    var self = this;
    document.getElementById('micanvas').onmousedown = function(e){
    self.posicionClick.x = Math.floor((e.pageX - this.offsetLeft) / self.anchoPiezas);
    self.posicionClick.y = Math.floor((e.pageY - this.offsetTop) / self.altoPiezas);
    }
  },

  distancia: function(x1, y1, x2, y2){
    return Math.abs(x1 - x2) + Math.abs(y1 - y2);
  },

  moverClick: function(){
    this.piezasClick();
    var self = this;
    $('#micanvas').click(function(e){
      if (self.distancia(self.filaVacia, self.columnaVacia, self.posicionClick.x, self.posicionClick.y) ==1){
        self.intercambiarPosiciones(self.filaVacia, self.columnaVacia, self.posicionClick.x, self.posicionClick.y);
        self.actualizarPosicionVacia(self.posicionClick.x, self.posicionClick.y);
        self.chequearSiGano();
      }
    });
  },

  mezclarPiezas: function(veces){
    if(veces<=0){return;}
    var self = this;
    var direcciones = [40, 38, 39, 37];
    var direccion = direcciones[Math.floor(Math.random()*direcciones.length)];
    this.moverEnDireccion(direccion);
    setTimeout(function(){
      self.mezclarPiezas(veces-1);
    },30 );
    
  },
    
    
  
  //al presionar le botón vuelve a iniciar el juego
  botonMezclar: function(){
    var self = this;
    $("#mezclar").on( "click", function() {
      self.iniciar()
    });
  },

  //muestro las instrucciones
  mostrarInstrucciones: function(instrucciones) {
    this.instrucciones = ["Mové las piezas con el teclado o el mouse.", "Encontrá el orden correcto de la imagen."];
    for (var i = 0; i < this.instrucciones.length; i++) {
      this.mostrarInstruccionEnLista(this.instrucciones[i], "lista-instrucciones");
    }
  },

  mostrarInstruccionEnLista: function(instruccion, idLista) {
    this.ul = document.getElementById(idLista);
    this.li = document.createElement("li");
    this.li.textContent = instruccion;
    this.ul.appendChild(this.li);
  },

  iniciar: function (cantMovimientos) {
    this.posicionClick = new Object;
    this.posicionClick.x = 0;
    this.posicionClick.y = 0; 
    this.cantidadDePiezasPorLado = Number(document.getElementById('cantidadPiezasPorLado').textContent);
    this.crearGrilla();
    this.elegirNivel();
    this.posicionValida();
    this.botonMezclar();
    this.filaVacia = this.cantidadDePiezasPorLado - 1;
    this.columnaVacia = this.cantidadDePiezasPorLado - 1;
    var self = this;
    this.iniciarImagen(function (){
      self.crearPiezas();
      self.construirPiezas();
      var cantidadDeMezclas = Math.max(Math.pow(this.cantidadDePiezasPorLado, 4), 100);
      self.piezaVacia(self.filaVacia, self.columnaVacia);
      self.mezclarPiezas(50);
      self.capturarTeclas();
      self.moverClick();
    });
  }
}

Juego.iniciar();
Juego.mostrarInstrucciones();
