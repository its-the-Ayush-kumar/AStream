async function loadClip(clip){
    //let clip = event.target.src;
    //clip = "../assets/" + clip + ".mp4";
    let url = `http://localhost:3000/video?play=${clip}`;

    /*let response = await fetch(url, {
      method: 'GET',
    });*/
    //console.log(response.json());

    let show = document.getElementById('playZone');
    let video = document.createElement('video');
    let source = document.createElement('source');

    video.id = "videoPlayer";
    video.controls = true;
    video.autoplay = true;

    source.src = url;

    video.append(source);
    show.innerHTML = '';
    show.append(video);
}

async function loadGallery(){
    let url = 'http://localhost:3000/gallery';
    let response = await fetch(url, {
        method: 'GET',
    });
    response = await response.json();
    let show = document.getElementById('showcase');
    show.innerHTML = '';

    if(response.status === 300){
        var textNode = document.createTextNode(response.msg);
        show.append(textNode);
    }
    else{
        console.log("clip list recieved !");
        console.log(response);
        response.forEach(resp => {
            resp = resp.split('.')[0];
            var li = document.createElement('div');
            var image = document.createElement('img');
            var title = document.createTextNode(resp);

            image.src = "../assets/thumbs/" + resp + ".jpg";
            image.height = 200;
            image.width = (200 * 16) / 9;

            li.addEventListener("click", function() {
                let arg = this.childNodes[0].src;
                arg = arg.split('/');
                arg = arg[arg.length - 1];
                arg = arg.substr(0, arg.length - 4);
                loadClip(arg);
            }, false);
            li.setAttribute('class', "clips");

            li.append(image);
            li.append(document.createElement('br'))
            li.append(title);

            show.append(li);
        });
    }
}

loadGallery();
