$(document).ready(function(){
	moment.locale('pt-br');
	var table = $("#table-server").DataTable({
		processing: true,
		serverSide:true,
		responsive:true,
		lengthMenu: [10,15,20,25],
		ajax: {
			url:"/promocao/datatables/server",
			data: "data"
		},
		columns: [
			{data: 'id'},
			{data: 'titulo'},
			{data: 'site'},
			{data: 'linkPromocao'},
			{data: 'descricao'},
			{data: 'linkImagem'},
			{data: 'preco', render: $.fn.dataTable.render.number('.',',',2,'R$')},
			{data: 'likes'},
			{data: 'dtCadastro', render: 
					function(dtCadastro){
						return moment(dtCadastro).format('LLL');
					}
			},
			{data: 'categoria.titulo'}
		],
		dom: 'Bfrtip',
		buttons: [
			{
				text:'Editar',
				attr: {
					id: 'btn-editar',
					type: 'button'
				},
				enabled: false
			},
			{
				text: 'Excluir',
				attr:{
					id: 'btn-excluir',
					type: 'button',
					
				},
				enabled: false
			}
		]
	});
	
	//ação para marcar/desmarcar botoes ao clicar na ordenacao
	$("#table-server thead").on('click', 'tr',function(){
			table.buttons().disable(); //desabilita os botoes de table
	});
	
	//ação para marcar/desmarcar linhas clicadas
	$("#table-server tbody").on('click', 'tr',function(){
		if($(this).hasClass('selected')){ //verifica se existe classe selected
			$(this).removeClass('selected');
			table.buttons().disable(); //desabilita os botoes de table
		}else{
			$('tr.selected').removeClass('selected');//procura uma tag tr q tenha a calsse selected naquele momento
			$(this).addClass('selected');
			table.buttons().enable();
		}
	});
	
	//abrir modal com as informações das promocoes
	$("#btn-editar").on('click', function(){
			
		if(idSelectedRow()){	
			var id = getPromoId();
			$.ajax({
				method: "GET",
				url: "/promocao/edit/" + id,
				beforeSend: function(){
					//remover todos os span que possui o .error-span
					$("span").closest('.error-span').remove();
					//remover bordas vermelhas
					$(".is-invalid").removeClass("is-invalid");
					//abrir modal
					$('#modal-form').modal('show');
					
				},
				success: function(data){
					$("#edt_id").val(data.id);
					$("#edt_site").text(data.site);
					$("#edt_titulo").val(data.titulo);
					$("#edt_descricao").val(data.descricao);
					$("#edt_preco").val(data.preco.toLocaleString('pt-BR', {
						minimumFractionDigits : 2,
						maximumFractionDigits : 2
					}));
					$("#edt_categoria").val(data.categoria.id);
					$("#edt_linkImagem").val(data.linkImagem);
					$("#edt_imagem").attr('src', data.linkImagem);
				
				},
				error: function(){
					alert('um erro ocorreu')
				}
			})
			
		}
		
	});
	
	//submit form para editar modal
	$("#btn-edit-modal").on('click', function(){
		var promo = {};
		
		promo.descricao = $("#edt_descricao").val();
		promo.preco = $("#edt_preco").val();
		promo.titulo = $("#edt_titulo").val();
		promo.categoria = $("#edt_categoria").val();
		promo.linkImagem = $("#edt_linkImagem").val();
		promo.id = $("#edt_id").val();
		
		$.ajax({
			method: "POST",
			url: "/promocao/edit",
			data: promo,
			beforeSend: function(){
			//remover todos os span que possui o .error-span
			$("span").closest('.error-span').remove();
			//remover bordas vermelhas
			$(".is-invalid").removeClass("is-invalid");
			
					
		},
			success: function(){
				$("#modal-form").modal("hide");
				table.ajax.reload();
			},
			statusCode:{
			422: function(xhr){
				console.log("status error > ", xhr.status);
				var errors = $.parseJSON(xhr.responseText);
				$.each(errors, function(key, val){
					$("#edt_" + key).addClass("is-invalid");
					$("#error-" + key)
					.addClass("invalid-feedback")
					.append("<span class='error-span'>" + val + "</span>")
					
				});
			}
		}
		})
	});;
	
	//alterar imagem na tag <img> do modal
	$("#edt_linkImagem").on("change", function(){
		var link = $(this).val();
		$("#edt_imagem").attr("src", link);
	})
	
	//abrir modal botao excluir
	$("#btn-excluir").on('click', function(){
		if(idSelectedRow()){
			$('#modal-delete').modal('show');
		}
	});
	
	//excluir promocao
	$("#btn-del-modal").on('click', function(){
		var id = getPromoId();
		
		$.ajax({
			method: "GET",
			url: "/promocao/delete/" + id,
			success: function(){
				$("#modal-delete").modal('hide');
				table.ajax.reload(); //instrucao ajax para a tabela for atualizada sem precisar de refresh
			},
			error: function(){
				alert("Algo deu errado");
			}
		})
	})
	
	
	function getPromoId(){
		return table.row(table.$('tr.selected')).data().id;
	}
	
	function idSelectedRow(){
		var trow = table.row(table.$('tr.selected'));
		return trow.data() !== undefined;
	}
	
	
})