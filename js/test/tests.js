var expect = chai.expect;

describe('Creación', function() {
    'use strict';

describe('Juego', function() {
    it('El Objeto Juego está definido', function(done) {
      if (!window.Juego){
        done(err);
      }
      else{ 
        done();
      }
    });
});

describe('Tamaño de la grilla', function() {
    it('La grilla tiene el tamaño correcto', function() {
      //se crea la grilla con un valor de cantidad de piezas por lado
      Juego.cantidadDePiezasPorLado = 8;
      Juego.crearGrilla();
      //se evalua si el tamaño de la grilla creada es correcto
      expect(Juego.grilla.length).to.equal(Juego.cantidadDePiezasPorLado);
      expect(Juego.grilla[0].length).to.equal(Juego.cantidadDePiezasPorLado);
    });
  });
});

//Testear posición válida
describe('Posicion válida', function(){
  it('Posición correcta', function(){
    Juego.cantidadDePiezasPorLado = 8
    Juego.crearGrilla()
    expect(Juego.posicionValida(2,2)).to.equal(true)
  });

  it('Posición incorrecta',function(){
    expect(Juego.posicionValida(2,8)).to.equal(false)
    expect(Juego.posicionValida(8,2)).to.equal(false)
  });
});

//Testear posición vacía
describe('Posición vacía', function(){
    it('Se actualiza la posición vacía', function(){
      Juego.filaVacia = 2;
        Juego.columnaVacia = 2;
        Juego.actualizarPosicionVacia(1,1);
        expect(Juego.filaVacia).to.equal(1);
      expect(Juego.columnaVacia).to.equal(1);			
    });
  });



/*//testear si gano
describe('chequear si gano', function (){
	it('La grilla está ordenada', function() {
		expect(!Juego.chequearSiGano).to.equal(false);
	
});
   });*/