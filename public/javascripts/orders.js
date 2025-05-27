$(document).ready(function(){

    $('#create_order').click(function(e){

        $('#create_order_popup').show()

    })

    $('#create_order_popup_close').click(function(e){

        $('#create_order_popup').hide()

    })

    $('#cancel_create_order').click(function(e){

        $('#create_order_popup').hide()

    })

    $('#submit_create_order').click(function(e){

        e.preventDefault()
        let data = {
            label:    $('#inpLabel').val(),
            id_client: $('#inpClient').val(),
            amount: $('#inpAmount').val(),
        }

        $.ajax({
            type: 'POST',
            data: data,
            url: '/orders/create',
            dataType: 'JSON'
        }).done(function( response ) {

            if (response.msg === '') {
                alert('Заказ создан')
                window.location.reload()
            }
            else {
                alert(response.msg)
            }
        });

    })

    $(document).on('click', '.change-status', function() {
        const id = $(this).data('id')
        const newStatus = prompt('Введите новый ID статуса:')
        if (!newStatus) return

        $.post(`/orders/${id}/change-status`, { new_status: newStatus }, function(response) {
            if (response.msg === '') {
                alert('Статус обновлён')
                location.reload()
            } else {
                alert(response.msg)
            }
        })
    })

    $(document).on('click', '.process-payment', function() {
        const id = $(this).data('id');
        console.log(id);
        if (!confirm('Провести платёж?')) return;

        // Загрузка данных заказа
        $.get(`/orders/order/${id}`, function(response) {
            const order = response;
            console.log(order);

            if (!order) {
                alert('Ошибка: заказ не найден');
                return;
            }

            const {amount, id_payment_type} = order;

            // Отправка платежа
            $.post(`/orders/${id}/process-payment`, {amount, id_payment_type}, function(response) {
                if (response.msg === '') {
                    alert('Платёж проведён');
                    location.reload();
                } else {
                    alert(response.msg);
                }
            });
        });
    });
});


