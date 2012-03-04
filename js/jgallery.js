/*!
 * jGallery jQuery Plugin v1.0
 *
 * http://blog.igorescobar.com/
 *
 * Copyright 2010, Igor Escobar
 *
 * Date: Mon Jul 5 22:43:34 2010
 */

var jgOptions = {};

jQuery.fn.setDefaults = function ( ) {
  // flag que indica quando o jGallery está aberto
  jgOptions.jgIsOpen = false;
  // algura máxima que uma imagem pode ter
  jgOptions.jgImageMaxHeight = ( $( window ).height () / 100 ) * 90;
  // largura máxima que uma imagem pode ter
  jgOptions.jgImageMaxWidth = ( $( window ).width () / 100 ) * 95;
  // elemento que faz o slide das imagens
  jgOptions.jgCarrocelGallery = $( '.jgCarrocel' );
  // elemento que guarda as imagens da galeria
  jgOptions.jgGallery = $( '.jgFullGallery' );
  // recebe a altura da galeria no popup
  jgOptions.jgGalleryHeight = 0;
  // recebe a largura máxima da galeria somando a largura de todas as miniaturas
  jgOptions.jgGalleryTotalWidth = 0;
  // guarda o numero de vezes que eu posso deslizar a galeria para frente
  jgOptions.jgMaxNextClick = 0;
  // guarda a pagina atual do slide
  jgOptions.jgCurrentPage = 0;
  // guarda o elemento do background
  jgOptions.jgBackground = $( '.jgBackground' );
  // guarda o elemento que envolve o jGallery
  jgOptions.jgContainer = $( '.jgContainer' );
  // elemento que contem navegacao, imagem grande e imagens da galeria
  jgOptions.jgContainerImage = $( '.jgContainer .image');
  // objeto da imagem grande
  jgOptions.jgContainerImageObject = $( '.jgContainer .image img#jgallery');
  // guarda as elementos da galeria que foi aberta
  jgOptions.openedGallery = null;
  // guarda os elementos da imagem que foi aberta
  jgOptions.openedImage = null;

}

/**
 * Cria todo o HTML necessário para que o jGallery funcione
 * - Botoes de next, prev e close.
 * - Botoes de slide entre as imagens da galeria.
 */
jQuery.fn.createjGallery = function ( ) {
    
  $( 'body' ).prepend (  
   '<div class="jgBackground"></div> \
    <div class="jgContainer"> \
      <div class="image"> \
        <div class="nav"> \
          <a href="#" rel="prev"><img src="' + jgOptions.jgRoot + 'images/prev.gif" /></a> \
          <a href="#" rel="next"><img src="' + jgOptions.jgRoot + 'images/next.gif" /></a> \
          <a href="#" rel="close"><img src="' + jgOptions.jgRoot + 'images/close.gif" /></a> \
        </div> \
        <div class="img"> \
          <img src="' + jgOptions.jgRoot + 'images/loading.gif" id="jgallery"/> \
          <div class="jgCarrocel"> \
            <div class="subNav"> \
              <a href="#" class="jgcarocel-prev"><img src="' + jgOptions.jgRoot + 'images/arrow-left.gif" /></a> \
              <a href="#" class="jgcarocel-next"><img src="' + jgOptions.jgRoot + 'images/arrow-right.gif" /></a> \
            </div> \
            <div class="jgFullGallery"></div> \
          </div> \
        </div> \
        <div class="legenda"></div> \
      </div> \
     </div>' );
    
}

/**
 * Aplica todos os eventos dentro do HTML responsável pelo jGallery
 * - Botoes de next, prev e close.
 * - Botoes de slide entre as imagens da galeria.
 * - Quando clicar fora da area do jGallery fecha a galeria.
 */
jQuery.fn.setjGalleryEvents = function ( ) {
  
  // mantem o fundo do jGallery sempre to tamanho da janela
  $( window ).bind ( 'resize' , function () {
    
    $( this )._setContainerCSS ( );
    $( this ).centralizaImageContainer ( );
    
  });
  
  // se clicar no background feche o jGallery
  jgOptions.jgBackground.bind ( 'click' , function () {
    
    jgOptions.jgIsOpen = false;
    jgOptions.jgCurrentPage = 0;
    jgOptions.jgGallery.animate ( { right: '0' } , 1000 );
    
    $( 'div.jgContainer > *' ).fadeOut ( 'slow' , function () {
      $( 'div.jgBackground' ).fadeOut ( 'slow' );
    });
    
    return false;
  });
  
  // fecha o jGallery
  $('.jgContainer .image div.nav a[rel=close]').bind ('click', function () {  
    
    $( '.jgBackground' ).trigger('click');
        
    return false;
  });
  
  // passa para proxima imagem
  $('.jgContainer .image div.nav a[rel=next]').bind ('click', function () {
    
    if ( jgOptions.openedImage.next().length > 0 )
      $(this)._switchImage ( jgOptions.openedImage.next('a') );
    
    return false;
  });
  
  // passa para imagem anterior
  $('.jgContainer .image div.nav a[rel=prev]').bind ('click', function () {
    
    if ( jgOptions.openedImage.prev().length > 0 )
      $(this)._switchImage ( jgOptions.openedImage.prev('a') );
    
    return false;
  });
  
  // SLIDES
  // Move Slide para trás
  $('.jgContainer .image .subNav a.jgcarocel-prev').bind ('click' , function () {
    
    var container_width = parseInt ( jgOptions.jgCarrocelGallery.css ( 'width' ).replace ('px', '' ), 10 );
    var atual_container_right = parseInt ( jgOptions.jgGallery.css ( 'right' ).replace ( 'px', '' ), 10 );
    
    if ( jgOptions.jgGallery.css('right') != '0px' && $( jgOptions.jgGallery ).queue ( "fx" ).length == 0 ) {
      jgOptions.jgCurrentPage -= 1;
      
      if ( ( atual_container_right - container_width ) < 0 )
        container_width = atual_container_right;    
    
      jgOptions.jgGallery.animate ( { right: '-=' + container_width } , 1000 );
    }
    
    return false;
  });
  
  // Move slide para frente
  $('.jgContainer .image .subNav a.jgcarocel-next').bind ('click' , function () {
    
    var container_width = parseInt ( jgOptions.jgCarrocelGallery.css ( 'width' ).replace ( 'px', '' ), 10 );
    
    jgOptions.jgMaxNextClick = Math.floor ( jgOptions.jgGalleryTotalWidth / ( container_width ) ) ;

    if ( jgOptions.jgCurrentPage < jgOptions.jgMaxNextClick ) { 
      jgOptions.jgCurrentPage += 1;
      jgOptions.jgGallery.animate ( { right: '+=' + container_width  } , 1000 );
    }
    
    return false;
  }); 
  
  jgOptions.jgCarrocelGallery.bind({
    mouseenter: function() {
      $( this ).fadeTo ('slow', 0.9);
    }
  })
  
  jgOptions.jgContainerImageObject.bind('mouseover', function () {
    jgOptions.jgCarrocelGallery.fadeTo ( 'slow' , 0.1 );
  });
  
  $(window).keydown ( function (event) {
    
    // [ mac, window, linux ]
    var key_left  = [37];
    var key_right = [39];
    
    var key_p   = [80];
    var key_n   = [78];
    var key_esc   = [27];
      
    if ( jgOptions.jgIsOpen == true && ( jQuery.inArray (event.keyCode, key_right) == 0 || jQuery.inArray (event.keyCode, key_n) == 0 ) )
      $('.jgContainer .image div.nav a[rel=next]').trigger('click');
      
    if ( jgOptions.jgIsOpen == true && ( jQuery.inArray (event.keyCode, key_left) == 0 || jQuery.inArray (event.keyCode, key_p) == 0 ) )
      $('.jgContainer .image div.nav a[rel=prev]').trigger('click');
    
    if ( jgOptions.jgIsOpen == true && ( jQuery.inArray (event.keyCode, key_esc) == 0  ) )
      $( '.jgBackground' ).trigger('click');
        
  });
}

jQuery.fn.extend({  
  
  // recebe o tamanho total que a galeria terá de largura
  _getJGalleryTotalWidth: function ( width , height ) {
    jgOptions.jgGalleryTotalWidth = 0;
    
    jgOptions.openedGallery.find('img').each ( function ( ) {
      jgOptions.jgGalleryTotalWidth += $( this ).attr('width') + 2;
    });
  },
  
  // recebe o tamano proporcional da imagem se baseando 
  // na largura e altura da janela
  _getProportionalSize: function ( width , height ) {
    
    var sizes = Array(width, height);

    if ( width > jgOptions.jgImageMaxWidth ) {
      sizes[0] = ( ( jgOptions.jgImageMaxWidth * width ) / width );
      sizes[1] = jgOptions.jgImageMaxWidth;     
    } 
    
    if ( height > jgOptions.jgImageMaxHeight ) {
      sizes[0] = ( (  jgOptions.jgImageMaxHeight * width ) / height );
      sizes[1] = jgOptions.jgImageMaxHeight;
    }

    return sizes;
  },
  
  // seta todas as configuracoes CSS necessárias para o jGallery
  // functionar corretamente
  _setContainerCSS: function ( ) {
    
    // Seta o alpha no background caso o usuário escolha
    if ( typeof jgOptions.jgBackgroundOpacity == "number" )
      jgOptions.jgBackground.css ( { opacity: jgOptions.jgBackgroundOpacity } );

    jgOptions.jgGallery.css ( { 'width': jgOptions.jgGalleryTotalWidth } );
    jgOptions.jgCarrocelGallery.css ( { 'width': jgOptions.jgContainerImageObject.css('width') } );
    jgOptions.jgCarrocelGallery.css ( { opacity: 0.2 } );
    
    window_height = ($( 'body' ).innerHeight () < $( window ).width ()) ? $( window ).width () : $( 'body' ).innerHeight ();
    // fundo do tamanho da janela
    jgOptions.jgBackground.css ({
      height: window_height ,
      width: $( window ).width ()
    });
    
  },
  
  // seta a origem e o tamanho de uma imagem 
  _setImage: function ( src, w, h ) {
    
    jgOptions.jgContainerImageObject.attr ( 'src', src );
    jgOptions.jgContainerImageObject.attr ( 'width', w );
    jgOptions.jgContainerImageObject.attr ( 'height', h );
    
  },
  
  // exibe o loader quando necessário
  _setLoader: function ( ) {
    
    jgOptions.jgContainerImage.append('<div class="jgloader"><img src="' + jgOptions.jgRoot + 'images/loading.gif" /></div>');
      
  },
  
  // esconde o loader quando necessário
  _unSetLoader: function ( ) {
    
    $('.jgloader').remove();
        
  },
  
  // efetua a troca das imagens quando clicadas
  // efetua a troca da imagem quando clicado nos 
  // botoes de navegacao next e prev
  _switchImage: function ( oLinkClick ) {
    
    jgOptions.openedImage = oLinkClick;
        
    $( this )._setLoader ( );
    
    // remove todas as classes referente a click de imagem
    $('img').removeClass('jgImageClicked');
    
    // acrescenta a classe referente a imagem que foi clicada
    jgOptions.openedImage.find('img').addClass('jgImageClicked');
    
    // faz o preload da imagem
    var image_title = oLinkClick.find( 'img' ).attr('title');
    
    var preload = new Image ( );
      preload.src =  oLinkClick.attr('href'); 
    
    // quando a imagem carregar
    $( preload ).bind ('load', function ( ) {
      
      // se os controles estiverem ocultos, mostre.
      if ( $( '.nav' ).css ( 'display' ) == 'none' ) 
        $( '.nav' ).fadeIn ( 'slow' );
      
      // recebe os tamanhos proporcionais
      var sizes = $(this)._getProportionalSize(preload.width, preload.height);
      
      // evita que a imagem fique maior do que o permitido
      preload.width = sizes[0];
      preload.height = sizes[1];
      
      jgOptions.jgGalleryHeight = jgOptions.openedImage.find ('img').height ();
              
      // esconde o container da imagem
      jgOptions.jgContainerImage.fadeOut('fast', function () {
        
        // esconde loader
        $( this )._unSetLoader ( );
        
        // carrega imagem clicada
        $( this )._setImage ( oLinkClick.attr ( 'href' ) , preload.width, preload.height );   
        
        // Atacha a legenda
        if ( image_title != '' ) {

          $( '.jgContainer .image div.legenda' ).html ( image_title );
          $( '.jgContainer .image div.legenda' ).fadeIn ( 'slow');
        } else {
          if ( jgOptions.jgCarrocelGallery.css('bottom') == '30px' )
            jgOptions.jgCarrocelGallery.animate({bottom: '-=30px'});
        }
        
        // mostra a imagem grande
        jgOptions.jgContainerImage.fadeIn ( 'fast' );
        
        // Atualiza as propriedades CSS e Container
        $( this ).centralizaImageContainer ( );
        $( this )._setContainerCSS ( );
        
      })
    });
  },
  
  // mantem a imagem sempre centralizada
  centralizaImageContainer: function ( ) {
    
    var calc_top = ( ( $( window ).height () / 2) - ( jgOptions.jgContainerImage.innerHeight() / 2 ) );
        
      calc_top = (calc_top < 0 ) ? 0 : calc_top;
      
    jgOptions.jgContainerImage.css ( {
      left: ( $( window ).width () - jgOptions.jgContainerImageObject.attr('width') ) / 2,
      top: calc_top
    });
    
  },
  jGallery: function ( parametros ) {
    
    $.extend ( jgOptions, parametros );
    
    $(this).createjGallery();
    
    $(this).setDefaults();
    
    
    $(this).setjGalleryEvents();
    
    
    // suporte para mais de uma galeria por pagina  
    $( this ).each ( function ( ) {
            
      $( this )._setContainerCSS ( );
      
      // abre a galeria se clicar em alguma imagem dela
      $( this ).find ( 'a:has(img)' ).bind ( 'click' , function ( ) { 
        
        jgOptions.openedGallery = $( this ).parent();
        
        jgOptions.jgIsOpen = true;
        
        $('.jgFullGallery').html ('');
        
        // clona a galeria
        jgOptions.openedGallery.find ( 'a:has(img)' ).each ( function () {
          $( $(this) ).clone ( ).appendTo ( $( '.jgFullGallery' ) );  
          $( this )._getJGalleryTotalWidth();
        });
        
        // objeto do link
        jgOptions.openedImage = $( this );      

        jgOptions.jgBackground.fadeIn ( 'slow' , function ( ) {
          // mostra o container
          jgOptions.jgContainer.fadeIn ( 2000 , function () {
            jgOptions.jgCarrocelGallery.slideDown ( 'slow' );
          });
          
          $( this )._switchImage ( jgOptions.openedImage );

        });
        
        return false;
        
      });
      
      // troca de imagem se clicarem em alguma imagem na box flutuante
      $( '.jgFullGallery' ).find ( 'a:has(img)' ).live ( 'click' , function ( ) {       
        
        // objeto do link
        jgOptions.openedImage = $( this );
  
        $( this )._switchImage ( jgOptions.openedImage );
          
        return false;
        
      });
    });
  } 
});