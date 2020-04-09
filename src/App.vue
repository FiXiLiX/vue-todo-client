<template>
<div class="container-fluid">
  <nav class="navbar navbar-expand-sm bg-light card">
      <ul class="navbar-nav">
          <li class="nav-item">
            <a v-on:click="getActiveTasks" class="nav-link btn btn-outline-info" :class="{active: showActive==true}">Active</a>
          </li>
          <li class="nav-item">
            <a v-on:click="getDeletedTasks" class="nav-link btn btn-outline-info" :class="{active: showActive==false}">Deleted</a>
          </li>
          <li class="nav-item"><a class="nav-link"> Order By :</a></li>
          <li class="nav-item">
            <a v-on:click="orderBy = 'created_at'" class="nav-link btn btn-outline-info" :class="{active : orderBy == 'created_at'}">Last Created</a>
          </li>
          <li class="nav-item">
            <a v-on:click="orderBy = 'updated_at'" class="nav-link btn btn-outline-info" :class="{active : orderBy == 'updated_at'}">Last Edited</a>
          </li>
          <li class="nav-item">
            <a v-on:click="orderBy = 'deleted_at'" v-if="showActive==false" class="nav-link btn btn-outline-info" :class="{active : orderBy == 'deleted_at'}">Last Deleted</a>
          </li>
      </ul>
  </nav>
  <div class="card-container">
      <div class="card">
          <form v-on:submit.prevent="addTask">
              <div class="from-group">
                  <label for="title">Title:</label>
                  <input type="text" name="title" v-model="newTask.title" placeholder="Go to shoping" class="form-control" required>
              </div>
              <div class="from-group p-t-2">
                  <label for="description">Description:</label>
                  <textarea name="description" v-model="newTask.description" rows="3" class="form-control"></textarea>
              </div>
              <button type="submit" class="btn btn-info mt-3 mb-0">Add</button>
              <p class="text-danger">{{newTask.error}}</p>
          </form>
      </div>
      <Task v-for="task in tasks" v-bind:key="task._id" v-bind:data="task" @deleted="getActiveTasks"></Task>
  </div>
</div>
</template>

<script>
import axios from 'axios'
import qs from 'querystring'
import Task from './components/Task'

export default {
  components: {Task},
  data () {
    return {
      tasks: [],
      newTask: {},
      showActive: true,
      orderBy: 'created_at'
    }
  },
  mounted () {
    this.getActiveTasks()
  },
  watch: {
    orderBy() {
      this.tasks.sort((a,b) => a[this.orderBy] > b[this.orderBy] ? -1 : a[this.orderBy] < b[this.orderBy] ? 1 : 0)
    }
  },
  methods: {
    getActiveTasks () {
      axios.get(this.$serverUrl + '/tasks')
      .then(response => {
        this.tasks = response.data
      })
      .catch((error) => {
        console.log(error.response)
      })
      this.showActive = true
    },
    getDeletedTasks () {
      axios.get(this.$serverUrl + '/tasks/deleted')
      .then(response => {
        this.tasks = response.data
      })
      .catch(error => {
        console.log(error.response)
      })
      this.showActive = false
    },
    addTask () {
      axios.post(this.$serverUrl + '/tasks', qs.stringify(this.newTask))
      .then(() => {
        this.getActiveTasks()
        this.newTask = {}
      })
      .catch(error => {
        this.newTask.error = error.response
      })
    }
  }
}
</script>

<style>
</style>
