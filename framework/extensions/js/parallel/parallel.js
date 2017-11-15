/*

    Parallel programming (Task parallelism)

    File name: parallel.js (Version: 1.5)
    Description: This file contains the Parallel framework for JS.

    Coded by George Delaportas (G0D)
    Copyright (C) 2015 - 2017
    Open Software License (OSL 3.0)

*/

// Parallel
function parallel()
{
    function task_manager_model()
    {
        function task_model()
        {
            this.id = null;
            this.delay = 0;
            this.status = null;
            this.file = null;
        }

        function tasks_list_model()
        {
            this.num = 0;
            this.tasks = [];
            this.workers = [];
        }

        function tasks()
        {
            this.num = function()
            {
                return tasks_list.num;
            };

            this.list = function(index)
            {
                if (utils.validation.misc.is_undefined(index))
                    return tasks_list.tasks;
                else
                    return tasks_list.tasks[index];
            };
        }

        this.create = function(worker_file, data, delay)
        {
            var __task_id = rnd_gen.generate(),
                __new_task = new task_model(),
                __new_worker = null;

            __new_task.id = __task_id;
            __new_task.file = worker_file;

            tasks_list.tasks.push(__new_task);
            tasks_list.num++;

            __new_worker = new Worker(__new_task.file);

            tasks_list.workers.push(__new_worker);

            if (!utils.validation.misc.is_undefined(delay))
            {
                __new_task.delay = delay;
                __new_task.status = tasks_status[2];

                clearTimeout(timer_handler);

                timer_handler = setTimeout(function() { __new_worker.postMessage(data); }, delay);
            }
            else
            {
                __new_task.status = tasks_status[0];

                __new_worker.postMessage(data);
            }

            __new_worker.onmessage = function(e) { console.log(e.data); };

            return __task_id;
        };

        this.destroy = function(task_id)
        {
            var __index = 0,
                __task = null;

            for (__index = 0; __index < tasks_list.num; __index++)
            {
                __task = tasks_list.tasks[__index];

                if (__task.id === task_id)
                {
                    tasks_list.workers[__index].terminate();
                    tasks_list.tasks[__index].status = tasks_status[1];

                    return true;
                }
            }

            return false;
        };

        this.kill = function()
        {
            var __index = 0;

            for (__index = 0; __index < tasks_list.num; __index++)
                tasks_list.workers[__index].terminate();

            tasks_list = new tasks_list_model();

            return null;
        };

        this.tasks = new tasks();

        var tasks_list = new tasks_list_model(),
            timer_handler = null;
    }

    function status()
    {
        this.running = function()
        {
            if (!init_ok)
                return false;

            list = [];

            for (index = 0; index < tasks_manager.tasks.num(); index++)
            {
                task = tasks_manager.tasks.list(index);

                if (task.status === tasks_status[0])
                    list.push(task);
            }

            return list;
        };

        this.ended = function()
        {
            if (!init_ok)
                return false;

            list = [];

            for (index = 0; index < tasks_manager.tasks.num(); index++)
            {
                task = tasks_manager.tasks.list(index);

                if (task.status === tasks_status[1])
                    list.push(task);
            }

            return list;
        };

        this.delayed = function()
        {
            if (!init_ok)
                return false;

            list = [];

            for (index = 0; index < tasks_manager.tasks.num(); index++)
            {
                task = tasks_manager.tasks.list(index);

                if (task.status === tasks_status[2])
                    list.push(task);
            }

            return list;
        };

        var index = 0, 
            list = [],
            task = null;
    }

    function tasks()
    {
        this.num = function()
        {
            if (!init_ok)
                return false;

            return tasks_manager.tasks.num();
        };

        this.list = function(index)
        {
            if (!init_ok)
                return false;

            if (utils.validation.misc.is_undefined(index))
                return tasks_manager.tasks.list();

            if (!utils.validation.numerics.is_integer(index) || index < 0 || index > (tasks_manager.num - 1))
                return false;

            return tasks_manager.tasks.list(index);
        };

        this.create = function(worker_file, data, delay)
        {
            if (!init_ok)
                return false;

            if (!utils.validation.alpha.is_string(worker_file) || utils.validation.misc.is_undefined(data) || 
                (!utils.validation.misc.is_undefined(delay) && !utils.validation.numerics.is_integer(delay) || 
                 delay < 1 || delay > 86400000))
                return false;

            return tasks_manager.create(worker_file, data, delay);
        };

        this.destroy = function(task_id)
        {
            if (!init_ok)
                return false;

            if (!utils.validation.numerics.is_integer(task_id))
                return false;

            return tasks_manager.destroy(task_id);
        };

        this.kill = function()
        {
            if (!init_ok)
                return false;

            tasks_manager.kill();

            return true;
        };
    }

    function init()
    {
        if (utils.validation.misc.is_undefined(Worker))
            return;

        init_ok = true;
    }

    var init_ok = false,
        tasks_status = ['RUN', 'END', 'DELAY'],
        task_max_id = 9007199254740992,
        tasks_manager = new task_manager_model(),
        rnd_gen = new pythia(),
        utils = new vulcan();

    this.tasks = new tasks();
    this.status = new status();

    init();
}
