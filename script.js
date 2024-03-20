let arr = [];
let vis = [];
let vec = [];
let cost = [];
let n = 10;

generateNewCities();

const button = document.querySelector("#start");
button.addEventListener('click', start_the_code);
const size = document.querySelector("#hello");
size.addEventListener('change', changed);

function changed(){
    n = parseInt(size.value);
    button.disabled = false;
    generateNewCities();
}

function generateNewCities(){
    arr = [];
    cost = [];
    vis = [];
    vec = [];

    for(let i=0; i<n; i++){
        arr[i] = { x: Math.floor((47 * Math.random()) + 1), y: Math.floor((26 * Math.random()) + 1) }
        cost[i] = [];
        vis[i] = 0;
    }

    for(let i=0; i<n; i++){
        cost[i][i] = 0;
        for(let j=i+1; j<n; j++){
            let distance_between = Math.abs(arr[i].x - arr[j].x) + Math.abs(arr[i].y - arr[j].y);
            cost[i][j] = distance_between;
            cost[j][i] = distance_between;
        }
    }

    showCities();
}

function showCities(){
    board.innerHTML = "";

    for(let i=0; i<arr.length; i++){
        houseElement = document.createElement('div');
        houseElement.style.gridRowStart = arr[i].y;
        houseElement.style.gridColumnStart = arr[i].x;

        if(vis[i] == 0){
            houseElement.classList.add('house_notVisited');
        }
        else{
            houseElement.classList.add('house_Visited');
        }
        
        if(i == 0) houseElement.classList.add('house_sourceNode');
        board.appendChild(houseElement);    
    }
}

function traverseCities(i){
    if(i == vec.length){
        button.disabled = false;
        return;
    }

    node = document.createElement('div');
    node.style.gridRowStart = vec[i].y;
    node.style.gridColumnStart = vec[i].x;
    node.classList.add('travelNode');
    board.appendChild(node);

    for(let j=0; j<arr.length; j++){
        if(vec[i].x == arr[j].x && vec[i].y == arr[j].y){
            vis[j] = 1;
            showCities();
        }
    }

    setTimeout(function(){
        traverseCities(i+1);
    }, 150);
}

function getPathData(){
    let limit;
    let dp;
    let path;

    function joinNodes(i, j){
        let n = arr[i].x;
        let m = arr[i].y;
        vec.push({x: n,   y: m});
    
        // Horizontal distance
        while(n != arr[j].x){
            if(n < arr[j].x) n = n + 1;
            else n = n - 1;
    
            vec.push({x: n,   y: m});
        }
    
        // Vertical distance
        while(m != arr[j].y){
            if(m < arr[j].y) m = m + 1;
            else m = m - 1;
    
            vec.push({x: n,   y: m});
        }
    }

    function solve(node, mask, cost, n) {
        if (mask === limit) {
            path[node][mask] = 0;
            return cost[node][0];
        }
        if (dp[node][mask] !== -1) return dp[node][mask];

        let ans = Infinity;
        for (let i = 0; i < n; i++) {
            if ((mask & (1 << i)) !== 0) continue;

            let newAns = cost[node][i] + solve(i, mask | (1 << i), cost, n);
            if (newAns < ans) {
                ans = newAns;
                path[node][mask] = i;
            }
        }

        return (dp[node][mask] = ans);
    }

    function findPath(cost) {
        let node = 0;
        let mask = 1;

        while(mask != limit){
            let nextNode = path[node][mask];
            joinNodes(node, nextNode);

            mask = mask | (1 << nextNode);
            node = nextNode;
        }

        joinNodes(node, 0);
    }

    function main(){
        limit = (1 << n) - 1;
        dp = new Array(n).fill(null).map(() => new Array(limit + 1).fill(-1));
        path = new Array(n).fill(null).map(() => new Array(limit + 1).fill(-1));

        solve(0, 1, cost, n);
        findPath(cost);
    }

    main();
}

function start_the_code(){
    button.disabled = true;
    getPathData();
    traverseCities(0);
}