let baseURL = document.getElementById('confluence-base-url').content;
let pageTitleJson = "";
let pageVerJson = "";
let selectedPID = AJS.params.pageId;

AJS.toInit(function(){
  let url = baseURL + "/rest/experimental/content/" + selectedPID + "/version"
            
  fetch(url)  //fetch all versions using fetch api
  .then(response => response.json())
  .then(json => {
      pageVerJson = json.results;
  });
})


/**
 * fetchPageVersionsOnClick - display all page versions on button click
 */

 function fetchPageVersionsOnClick(){
  alert("Fetching contents in progress");

  let pageVer1Sel = document.getElementById("pageVersionSel1");
  let pageVer2Sel = document.getElementById("pageVersionSel2");

  //ensure that each page version is only shown once when button is clicked multiple times
  if(pageVer1Sel.length > 0 || pageVer2Sel.length > 0){
    pageVer1Sel.innerHTML = ""; //remove all exisiting options first
    pageVer2Sel.innerHTML = "";
  }

  for(var key in pageVerJson){
    let newOp1 = document.createElement("option");
    let newOp2 = document.createElement("option");

    let num = pageVerJson[key].number;

    newOp1.textContent = num;
    newOp2.textContent = num;

    newOp1.setAttribute("id", "1." + num.toString());
    newOp2.setAttribute("id", "2." + num.toString());

    pageVer1Sel.appendChild(newOp1);
    pageVer2Sel.appendChild(newOp2);

    let contentURL = "";
    let fetchURL = baseURL + "/rest/experimental/content/" + selectedPID + "/version/" + num;


    fetch(fetchURL)// fetch page version content
    .then(response => response.json())
    .then(json => {
        contentURL = baseURL+json.content._links.webui;
        
        $.ajax({
            url : contentURL,
            success : function(response){
                let contentTitle = "<h3>Version " + num + "</h3>";
                let content = $(response).find("#main-content").html();
                
                content = contentTitle + content;

                newOp1.setAttribute("value", content);  //set the content as the value of the option
                newOp2.setAttribute("value", content);
            }
        })
    });
  }

  alert("Fetching completed!");
}



