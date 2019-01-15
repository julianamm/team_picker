const express = require('express');
const knex = require("../db/index");
const router = express.Router();

// Get /new view
router.get('/new', (req, res, next) => {
  res.render('new');
});

// Post /new #creating new cohorts
router.post('/new_cohort', (req, res) => {
  if (req.body.logo || req.body.name || req.body.members) {
    const logo = req.body.logo;
    const name = req.body.name;
    const members = req.body.members;

    knex
    .insert({
      logo: logo,
      name: name,
      members: members,
    })
    .into("cohorts")
    .returning("*")
    .then((cohort) => {
      console.log("Show Cohort:", cohort[0].id);
      // res.json(cohort);
      // res.render("cohorts");
      res.redirect(`cohort/${cohort[0].id}`);
    });
    } else {
    res.render("new")
  }
  });

  router.get('/', (req, res) => {
    knex
    .select("*")
    .from('cohorts')
    .orderBy('createdAt', "DESC")
    .then(cohorts => {
      res.render('home', { cohorts: cohorts });
    });
  });

  // GET /cohorts/:id
  // #new cohort
  router.get("/cohort/:id", (req, res) => {
    const cohortId = req.params.id;
    const optMeth = req.query.method
    const qty = parseInt(req.query.qty);
  
    console.log(optMeth, qty);
    console.log(cohortId);
    knex
      .select("*")
      .from("cohorts")
      .where({ id: cohortId })
      .then(results => {
        console.log(results);
        const [cohort] = results;
        // res.send(cohort);
        let members_arr = (cohort.members).split(',').map(member => member.trim());
        // console.log(members_arr);

        function shuffleArray(members_arr) {
          for (let i = members_arr.length - 1; i > 0; i--) {
            let j = Math.floor(Math.random() * (i + 1));
            let temp = members_arr[i];
            members_arr[i] = members_arr[j];
            members_arr[j] = temp;
          }
          return members_arr;
        }
        // console.log(shuffleArray(members_arr));
        members_arr = shuffleArray(members_arr);

        let new_team = [];
        if (optMeth === "team_val"){
            while(members_arr.length) {new_team.push(members_arr.splice(0,qty))}
          } else {
            let new_length = (members_arr.length / qty)
            
            while(members_arr.length > 0 && new_length <= members_arr.length) { 
              console.log('new length', new_length)
              console.log('array length', members_arr.length)
              console.log(new_length <= members_arr.length)
              new_team.push(members_arr.splice(0,new_length));
              new_length = Math.ceil((members_arr.length / qty)); 
            }
        }

        console.log(new_team);
        res.render('cohort', {
          cohort: cohort || {},
          new_team: new_team || [],
          qty: qty,
          optMeth: optMeth
        });
      })
    });

module.exports = router;
