/*!
 * jGallery jQuery Plugin v1.0
 *
 * http://blog.igorescobar.com/
 *
 * Copyright 2010, Igor Escobar
 *
 * Date: Mon Jul 5 22:43:34 2010
 */

var jgOptions = null;

jQuery.fn.setDefaults = function ( ) {
	jgOptions = {
		// flag que indica quando o jGallery está aberto
		jgIsOpen: false, 
		// algura máxima que uma imagem pode ter
		jgImageMaxHeight: ( $( window ).height () / 100 ) * 80, 
		// largura máxima que uma imagem pode ter
		jgImageMaxWidth: ( $( window ).width () / 100 ) * 95, 
		// elemento que faz o slide das imagens
		jgCarrocelGallery : $( '.jgCarrocel' ), 
		// elemento que guarda as imagens da galeria
		jgGallery : $( '.jgFullGallery' ), 
		// recebe a altura da galeria no popup
		jgGalleryHeight : 0, 
		// recebe a largura máxima da galeria somando a largura de todas as miniaturas
		jgGalleryTotalWidth : 0, 
		// guarda o numero de vezes que eu posso deslizar a galeria para frente
		jgMaxNextClick : 0, 
		// guarda a pagina atual do slide
		jgCurrentPage : 0, 
		// guarda o elemento do background
		jgBackground : $( '.jgBackground' ), 
		// guarda o elemento que envolve o jGallery
		jgContainer : $( '.jgContainer' ), 
		// elemento que contem navegacao, imagem grande e imagens da galeria
		jgContainerImage : $( '.jgContainer .image'), 
		// objeto da imagem grande
		jgContainerImageObject : $( '.jgContainer .image img#jgallery'), 
		// guarda as elementos da galeria que foi aberta
		openedGallery : null, 
		// guarda os elementos da imagem que foi aberta
		openedImage : null 
	}
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
					<a href="#" rel="prev"><img src="images/prev.gif" /></a> \
					<a href="#" rel="next"><img src="images/next.gif" /></a> \
					<a href="#" rel="close"><img src="images/close.gif" /></a> \
				</div> \
				<img src="images/loading.gif" width="36" height="36" id="jgallery"/> \
				<div class="legenda"></div> \
				<div class="jgCarrocel"> \
					<div class="subNav"> \
						<a href="#" class="jgcarocel-prev"><img src="images/arrow-left.gif" /></a> \
						<a href="#" class="jgcarocel-next"><img src="images/arrow-right.gif" /></a> \
					</div> \
					<div class="jgFullGallery"></div> \
				</div> \
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
		
		if ( jgOptions.jgGallery.css('right') != '0px' && $( jgOptions.jgGallery ).queue ( "fx" ).length == 0 ) {
			jgOptions.jgCurrentPage -= 1;
			jgOptions.jgGallery.animate ( { right: '-=300' } , 1000 );
		}
		
		return false;
	});
	
	// Move slide para frente
	$('.jgContainer .image .subNav a.jgcarocel-next').bind ('click' , function () {
		
		jgOptions.jgMaxNextClick = Math.floor ( jgOptions.jgGalleryTotalWidth / jgOptions.jgCarrocelGallery.css ('width').replace ('px', '') );
		
		if( jgOptions.jgCurrentPage < jgOptions.jgMaxNextClick ) { 
			jgOptions.jgCurrentPage += 1;
			jgOptions.jgGallery.animate ( { right: '+=300' } , 1000 );
		}
		
		return false;
	});	
	
	jgOptions.jgCarrocelGallery.bind({
		mouseenter: function() {
			$( this ).fadeTo ('slow', 0.9);
		},
		mouseleave: function () {
			$( this ).fadeTo ('slow', 0.2);
		}
	})
	
	$(window).keydown ( function (event) {
		
		// [ mac, window, linux ]
		var key_left	= [37];
		var key_right	= [39];
		
		var key_p		= [80];
		var key_n		= [78];
		var key_esc		= [27];
			
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
			jgOptions.jgGalleryTotalWidth += $( this ).attr('width');
		});
	},
	
	// recebe o tamano proporcional da imagem se baseando 
	// na largura e altura da janela
	_getProportionalSize: function ( width , height ) {
		
		var sizes = Array(width, height);

		if ( width > jgOptions.jgImageMaxWidth ) {
			sizes[1] = jgOptions.jgImageMaxWidth;		
			sizes[0] = ( ( sizes[1] * width ) / width );
		}
		
		if ( height > jgOptions.jgImageMaxHeight ) {
			sizes[0] = ( ( sizes[1] * height ) / height );
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

		jgOptions.jgGallery.css ( { 'width': $( window ).width () } );
		jgOptions.jgCarrocelGallery.css ( { 'width': jgOptions.jgContainerImageObject.css('width') } );
		jgOptions.jgCarrocelGallery.css ( { opacity: 0.2 } );
		
		// fundo do tamanho da janela
		jgOptions.jgBackground.css ({
			height: $( window ).height () ,
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
		
		jgOptions.jgContainerImage.append('<div class="jgloader"><img src="images/loading.gif" /></div>');
			
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
				$( '.jgContainer .image div.legenda' ).html ( image_title );
				$( '.jgContainer .image div.legenda' ).fadeIn ( 'slow' );
				
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
		
		$(this).createjGallery();
		$(this).setDefaults();
		$(this).setjGalleryEvents();
		
		$.extend ( jgOptions, parametros );
		
		// suporte para mais de uma galeria por pagina	
		$( this ).each ( function () {
			
			$( this )._setContainerCSS ( );
			
			jgOptions.openedGallery = $( this );
			
			// abre a galeria se clicar em alguma imagem dela
			$( this ).find ( 'a:has(img)' ).bind ( 'click' , function ( ) {	
				
				jgOptions.jgIsOpen = true;
				
				// clona a galeria
				jgOptions.openedGallery.find ( 'a:has(img)' ).each ( function () { 
					
					if ( $(this).attr('href') == $( '.jgFullGallery' ).find('a:has(img):first').attr('href')) 
						return false;

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