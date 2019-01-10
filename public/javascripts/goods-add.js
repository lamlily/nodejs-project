 // 图片上传
 let rootPath='http://127.0.0.1:3000'
 let upload=false //当前图片上传状态
 function ajaximg(){
      let data=new FormData();
      let file=$('#file')[0]['files'][0]
      data.append('test',file)
       $.ajax({
           url: rootPath+'/setting/img',
           type: 'POST',
           data: data,
           cache: false,
           contentType: false,
           processData: false,
           success: function(data){
              console.log(data)
              if (data.err==0) {
                  //显示缩略图
                  $('#uploadimg').attr('src',rootPath+data.data)
                  //更改图片的上传状态
                  upload=data.data;//改成相对路径的字符串即为true;
              }else{
                  alert(data.msg)
              }
           },
           error: function(jqXHR, textStatus, errorThrown){
            //    document.getElementById("status").innerHTML = "<span style='color:#EF0000'>连接不到服务器，请检查网络！</span>";
           }
       });
  }
 //form表单整体 上传 接口
 function goodsadd(){
  // 先获取到图片地址，前提是先上传图片
     if (upload) {
         let url=rootPath+'/setting/addGood'
         let data={
          //addGoods参数
            name:$('#name').val(),
            type:$('#type').val(),
            desc:$('#desc').val(),
            price:$('#price').val(),
            stock:$('#stock').val(),
            imgpath:upload
         }

         $.post(url,data,function(res){
             if (res == "success") {
            //如果提交审核成功，跳回首页goodslist（因为该框架的方法不是Location.href无法使用该方法，goodsadd依然为goodslist页面，用的是父级子级页面层，js中引用的，直接引用）
            layer_close();
            // 重新加载goodslist页面渲染新加入的商品信息
           getShowList();
            // 框架的跳回原页面方法
            //刷新页面goodslist页面
            window.parent.location.reload(true);
            // location.href="goods-list.html";
             
          


             }else{
             //如果提交审核失败提示重新填写
             alert("上传失败请重试")
             }
         })
     }else{
         alert('请先上传图片')
     }
 }
$(function(){

  // 数据上传

 
  /*地方代码*/
//   $('.skin-minimal input').iCheck({
//       checkboxClass: 'icheckbox-blue',
//       radioClass: 'iradio-blue',
//       increaseArea: '20%'
//   });
  
  $list = $("#fileList"),
  $btn = $("#btn-star"),
  state = "pending",
  uploader;

  var uploader = WebUploader.create({
      auto: true,
      swf: 'lib/webuploader/0.1.5/Uploader.swf',
  
      // 文件接收服务端。
      server: 'http://lib.h-ui.net/webuploader/0.1.5/server/fileupload.php',
  
      // 选择文件的按钮。可选。
      // 内部根据当前运行是创建，可能是input元素，也可能是flash.
      pick: '#filePicker',
  
      // 不压缩image, 默认如果是jpeg，文件上传前会压缩一把再上传！
      resize: false,
      // 只允许选择图片文件。
      accept: {
          title: 'Images',
          extensions: 'gif,jpg,jpeg,bmp,png',
          mimeTypes: 'image/*'
      }
  });
  uploader.on( 'fileQueued', function( file ) {
      var $li = $(
          '<div id="' + file.id + '" class="item">' +
              '<div class="pic-box"><img></div>'+
              '<div class="info">' + file.name + '</div>' +
              '<p class="state">等待上传...</p>'+
          '</div>'
      ),
      $img = $li.find('img');
      $list.append( $li );
  
      // 创建缩略图
      // 如果为非图片文件，可以不用调用此方法。
      // thumbnailWidth x thumbnailHeight 为 100 x 100
      uploader.makeThumb( file, function( error, src ) {
          if ( error ) {
              $img.replaceWith('<span>不能预览</span>');
              return;
          }
  
          $img.attr( 'src', src );
      }, thumbnailWidth, thumbnailHeight );
  });
  // 文件上传过程中创建进度条实时显示。
  uploader.on( 'uploadProgress', function( file, percentage ) {
      var $li = $( '#'+file.id ),
          $percent = $li.find('.progress-box .sr-only');
  
      // 避免重复创建
      if ( !$percent.length ) {
          $percent = $('<div class="progress-box"><span class="progress-bar radius"><span class="sr-only" style="width:0%"></span></span></div>').appendTo( $li ).find('.sr-only');
      }
      $li.find(".state").text("上传中");
      $percent.css( 'width', percentage * 100 + '%' );
  });
  
  // 文件上传成功，给item添加成功class, 用样式标记上传成功。
  uploader.on( 'uploadSuccess', function( file ) {
      $( '#'+file.id ).addClass('upload-state-success').find(".state").text("已上传");
  });
  
  // 文件上传失败，显示上传出错。
  uploader.on( 'uploadError', function( file ) {
      $( '#'+file.id ).addClass('upload-state-error').find(".state").text("上传出错");
  });
  
  // 完成上传完了，成功或者失败，先删除进度条。
  uploader.on( 'uploadComplete', function( file ) {
      $( '#'+file.id ).find('.progress-box').fadeOut();
  });
  uploader.on('all', function (type) {
      if (type === 'startUpload') {
          state = 'uploading';
      } else if (type === 'stopUpload') {
          state = 'paused';
      } else if (type === 'uploadFinished') {
          state = 'done';
      }

      if (state === 'uploading') {
          $btn.text('暂停上传');
      } else {
          $btn.text('开始上传');
      }
  });

  $btn.on('click', function () {
      if (state === 'uploading') {
          uploader.stop();
      } else {
          uploader.upload();
      }
  });

});