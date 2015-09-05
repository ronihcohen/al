/**
 * Created by lupi on 04/09/2015.
 */

// Load the IFrame Player API code asynchronously.
var tag = document.createElement('script');
tag.src = "https://www.youtube.com/player_api";
var firstScriptTag = document.getElementsByTagName('script')[0];
firstScriptTag.parentNode.insertBefore(tag, firstScriptTag);


var player;
function onYouTubePlayerAPIReady(skip,limit) {
    skip = skip || 0;
    limit = limit || 50;
    fetch('/feed/'+skip+'/'+limit)
        .then(function(response) {
            return response.json()
        }).then(function(json) {
            for (let post of json){
                if (post.type === 'video_share_youtube'){
                let textContent = '';
                if (post.title){
                    let titleMaxLength = 36;
                    if (post.title.length < titleMaxLength){
                        textContent = post.title;
                    } else {
                        textContent = post.title.substring(0,titleMaxLength)+'..';
                    }
                }

                let container = document.createElement('div');
                let img = document.createElement('img');
                img.src = post.media.image.src;
                let title = document.createElement('span');
                title.textContent = textContent;


                container.addEventListener("click", ()=>{
                    console.log(post.url);
                    console.log(post.type);

                        var re = /(be%2F|watch%3Fv%3D)(.{11})/;
                        var str = post.url;
                        var m;

                        if ((m = re.exec(str)) !== null) {
                            if (m.index === re.lastIndex) {
                                re.lastIndex++;
                            }

                            if (player){
                                player.loadVideoById({'videoId': m[2]});
                            } else {
                                player = new YT.Player('ytplayer', {
                                    height: '200',
                                    width: '200',
                                    videoId: m[2],
                                    playerVars: {autoplay:true}
                                });
                            }

                            console.info('Playing Youtube video.');
                        }





                });


                document.body.appendChild(container);
                container.appendChild(title);
                container.appendChild(img);
            }
            }
        }).catch(function(ex) {
            console.log('parsing failed', ex)
        })
}

var currentPage = 1;
var pageSize = 50;
document.addEventListener('scroll', ()=>{
    let current =  Math.round((document.documentElement && document.documentElement.scrollTop) || document.body.scrollTop+window.innerHeight);
    //let max = Math.round(document.body.scrollTop +window.innerHeight);
    let max = document.documentElement.scrollTopMax || document.body.scrollHeight;


    console.log('max: '+max+' current: '+current);
    if (max === current){
        onYouTubePlayerAPIReady(pageSize*currentPage,pageSize);
        currentPage++;
    }
});


