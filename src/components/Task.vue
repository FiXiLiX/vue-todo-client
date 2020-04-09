<template>
    <div class="card">
        <div v-if="status == 'show'">
            <h2>{{data.title}}</h2>
            <p>Created: {{data.created_at}}</p>
            <p v-if="data.created_at!=data.updated_at">Edited: {{data.updated_at}}</p>
            <p v-if="data.deleted_at!=undefined">Deleted: {{data.deleted_at}}</p>
            <p v-if="data.description!=undefined">{{data.description}}</p>
        </div>
        <div v-if="status == 'show' && data.deleted_at==undefined" class="btn-group btn-block">
                <button v-on:click="status='edit'" class="btn btn-info">Edit</button>
                <button v-on:click="deleteTask" class="btn btn-info">Delete</button>
        </div>
        <div v-if="status == 'edit'">
            <form v-on:submit.prevent="editTask">
                <div class="form-group">
                <label for="title">Title: </label>
                <input type="text" name="title" id="title" v-model="editedFields.title" class="form-control" required>
                </div>
                <div class="form-group">
                <label for="description">Description:</label>
                <textarea name="description" id="description" v-model="editedFields.description" rows="3" class="form-control"></textarea>
                </div>
                <div class="btn-group btn-block" v-if="data.deleted_at==undefined">
                    <button v-on:click="status='show'" class="btn btn-info">Cancel</button>
                    <button type="submit" class="btn btn-info">Edit</button>
                </div>
            </form>
        </div>
    </div>
</template>

<script>
import axios from 'axios'
import qs from 'querystring'
import moment from 'moment'

export default {
    props: ['data'],
    data () {
        return{
            status: 'show'
        }
    },
    computed: {
        editedFields () {
            return {
                title: this.data.title,
                description: this.data.description,
            }
        }
    },
    mounted() {
            this.formatDates()
    },
    watch: {
        data() {
            this.formatDates()
        }
    },
    methods: {
        deleteTask () {
            axios.delete(this.$serverUrl + '/tasks/' + this.data._id)
            .then(() => {
                this.$emit('deleted')
            })
            .catch(error => {
                console.log(error)
            })
        },
        editTask () {
            axios.patch(this.$serverUrl +  '/tasks/' + this.data._id, qs.stringify(this.editedFields))
            .then(() => {
                this.status = 'show'
                this.$emit('deleted')
            })
            .catch(error => {
                console.log(error)
            })
        },
        formatDates () {
            var format = 'DD/MM/YYYY hh:mm'
            var created = new Date(this.data.created_at)
            this.data.created_at = moment(created).format(format)

            var updated = new Date(this.data.updated_at)
            this.data.updated_at = moment(updated).format(format)

            if(this.data.deleted_at!=undefined){
                var deleted = new Date(this.data.deleted_at)
                this.data.deleted_at = moment(deleted).format(format)
            }
        }
    }
}
</script>