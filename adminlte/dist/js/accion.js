
var habitaciones = new Array();
var sumall = 0;

//traer los tipos de habitaciones creadas en la base de datos
function get_habitaciones() {
    var url = "http://127.0.0.1:8000/api/habitaciones";
    $.ajax({
        url: url,
        method: "get",
        datatype: "JSON",
        success: function (respuesta) {

            $('#tipos_habitacion tbody').empty();
            //  console.log(respuesta);
            respuesta.forEach(e => {
                var detalle = '<tr style="cursor:pointer;"> ' +
                    '<td style="text-align:center;"  >' + e.id + '</td>' +
                    '<td style="text-align:center;"  >' + e.nombre + '</td>' +
                    '<td style="text-align:center;"  >' + e.acomodacion_habitacion[0].nombre + '</td>' +
                    '<td style="text-align:center;"  >' + e.acomodacion_habitacion[0].nombre + '</td>' + '</tr>';
                $('#tipos_habitacion tbody').append(detalle);

            });

        },
        error: function () {
            console.log("No se ha podido obtener la información");
        }
    });
}
//traer las ciudades registradas en la base de datos y cargarlas en el select 
function get_ciudades() {

    var url = "http://127.0.0.1:8000/api/ciudades";
    $.ajax({
        url: url,
        method: "get",
        datatype: "JSON",
        success: function (respuesta) {

            var charge_select = "";
            respuesta.forEach(element => {
                var htmlservice = '<option value="' + element.id + '">' + element.nombre + '</option>';
                charge_select += htmlservice;
            });
            $('#ciudad_hotel').append(charge_select);
        },
        error: function () {
            console.log("No se ha podido obtener la información");
        }
    });
}

//crear el hotel en la base de datos de la
function create_ciudades() {
    var url = "http://127.0.0.1:8000/api/create_hotel";
    var data = {
        nombre: $("#nombre_hotel").val(),
        direccion: $("#direccion_hotel").val(),
        ciudad: $("#ciudad_hotel").val(),
        nit: $("#nit_hotel").val(),
        telefono: $("#telefono_hotel").val(),
        correo: $("#correo_hotel").val(),
        num_habitaciones: $("#habitaciones_hotel").val(),
        estado: $("#estado").val()
    }
    // console.log(data);
    $.ajax({
        url: url,
        method: "POST",
        data: data,
        datatype: "JSON",
        success: function (respuesta) {

            if (respuesta != 'exist') {
                $("#nombre_hotel").val("");
                $("#direccion_hotel").val("");
                $("#ciudad_hotel").val("");
                $("#nit_hotel").val("");
                $("#telefono_hotel").val("");
                $("#correo_hotel").val("");
                $("#habitaciones_hotel").val("");
                $("#estado").val("x")

                ejecutar_alerta("Registro exitoso", "success");
            } else {
                ejecutar_alerta("El hotel ya se encuentra registrado", "error");
            }

        },
        error: function () {
            console.log("No se ha podido obtener la información");
        }
    });
}
//traer el listado de hoteles
function get_hoteles() {

    var url = "http://127.0.0.1:8000/api/hotel";
    $.ajax({
        url: url,
        method: "get",
        datatype: "JSON",
        success: function (respuesta) {
            $('#listado_hotel tbody').empty();

            respuesta.forEach(e => {
                if (e.num_habitaciones==0) {
                    var act="No puede asignar";
                }else{

                    var act = "<button title='Asignar habitaciones' data-id='" + e.num_habitaciones +','+e.id+ "' data-toggle='modal' data-target='#myModal' class='btn btn-warning btn-sm asignar_h'><i class='fa fa-plus-square' aria-hidden='true'></i></button>";
                }
                var detalle = '<tr style="cursor:pointer;"> ' +
                    '<td style="text-align:center;"  >' + e.id + '</td>' +
                    '<td style="text-align:center;"  >' + e.nombre + '</td>' +
                    '<td style="text-align:center;"  >' + e.nit + '</td>' +
                    '<td style="text-align:center;"  >' + e.ciudad.nombre + '</td>' +
                    '<td style="text-align:center;"  >' + e.direccion + '</td>' +
                    '<td style="text-align:center;"  >' + e.telefono + '</td>' +
                    '<td style="text-align:center;"  >' + e.correo + '</td>' +
                    '<td style="text-align:center;"  >' + e.num_habitaciones + '</td>' +
                    '<td style="text-align:center;"  >' + act + '</td>' + '</tr>';
                $('#listado_hotel tbody').append(detalle);

            });
            get_habitaciones_select();
        },
        error: function () {
            console.log("No se ha podido obtener la información");
        }
    });
}
//cargar los tipos de habitacion en el select
function get_habitaciones_select() {
    var url = "http://127.0.0.1:8000/api/habitaciones";
    $.ajax({
        url: url,
        method: "get",
        datatype: "JSON",
        success: function (respuesta) {

            var charge_select2 = "";
            respuesta.forEach(element => {
                var htmlservice2 = '<option value="' + element.id + '">' + element.nombre + '( ' + element.acomodacion_habitacion[0].nombre + ' )' + '</option>';
                charge_select2 += htmlservice2;
            });
            $('#listado_habitaion').append(charge_select2);

        },
        error: function () {
            console.log("No se ha podido obtener la información");
        }
    });
}

$(document).on("click", ".asignar_h", function () {
    var dato = $(this).data("id");
    var explode= dato.split(",");
    localStorage.clear();
    localStorage.setItem('hotel_id',explode[1]);
    $("#h_disponibles").val(explode[0]);
});

$(document).on("click", ".add_h", function () {

    var cantidad = parseInt($("#h_asignadas").val());
    var disponibles = $("#h_disponibles").val();
    var acomodacion = $("#listado_habitaion").val();
    var textselector = $("#listado_habitaion option:selected").text();

    if (sumall < disponibles && cantidad <= disponibles) {


        var data = {
            cantidad: cantidad,
            acomo: acomodacion,
            texto: textselector,
            hotel: localStorage.getItem('hotel_id')
        }
        habitaciones.push(data);
        sumall = habitaciones.map(item => item.cantidad).reduce((prev, curr) => prev + curr, 0);

    } else if (sumall >= disponibles || cantidad > disponibles) {
        ejecutar_alerta("Cantidad no permitida", "error");
    }

    $('#contenido').empty();

    habitaciones.forEach((e2, index) => {
        var detalle_habitaciones = '<div class="row habitaciones' + index + '">' +
            '<div class="col-md-6">' + '<input readonly class="form-control nombre_material' + index + '" value="' + e2.cantidad + ' ' + e2.texto + '" style="margin-top:5px"></div>' +
            '<div class="col-md-1"><button class="btn btn-danger delete_asignada" style="margin-top:5px"  data-id="' + index + '"><i class="fa fa-trash" aria-hidden="true"></i></button></div>' +
            '<br></div>';

        $('#contenido').append(detalle_habitaciones);
    });


});

$(document).on('click', '.delete_asignada', function (e) {
    var id = $(this).data("id");
    $(".habitaciones" + id).remove();
    sumall = sumall - habitaciones[id].cantidad;
    // var index = habitaciones.indexOf(id);
    // if (index > -1) {
    //     habitaciones.splice(index, 1);
    // }

    delete habitaciones[id];
});

function guardar_asignacion() {
    
    var url = "http://127.0.0.1:8000/api/guardar_h";
    

    habitaciones.forEach(element => {
        $.ajax({
        url: url,
        method: "POST",
        data: element,
        datatype: "JSON",
        success: function (respuesta) {
            console.log(respuesta);
        },
        error: function () {
            console.log("No se ha podido obtener la información");
        }
    });
    });
    
    location.reload();
}

function ejecutar_alerta(sms, icon) {
    swal({
        title: sms,
        icon: icon,
        // button: "Aww yiss!",
    });
}