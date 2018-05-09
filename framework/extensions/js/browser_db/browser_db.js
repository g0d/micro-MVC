/*
	Browser DB

	File: browser_db.js (Version: 0.7)
	Description: This is the Browser DB JS file.

	Coded by George Delaportas (G0D)
    Copyright (C) 2017
    Open Software License (OSL 3.0)
*/

// Browser DB
function browser_db()
{
	// Model
	function model_class()
	{
		this.db_records = []; 			// Initialize DB records
		this.selected_record = null;	// Selected record
	}

	// View
	function view_class()
	{
		// Reload data inside the records list if local storage has previously saved data
		this.reload_data = function()
		{
			var __records = localStorage.getItem('db_records');

			if (!__records)
				return false;

			// Populate records DB
			bdb.model.db_records = JSON.parse(__records);

			return true;
		};
	}

	// Controller
	function controller_class()
	{
		var __self = this;

		// Generate UID
		function generate_uid()
		{
			var __record_id = rnd_gen.generate();

			if (__self.duplicates_exist(__record_id))
			{
				var __index = 0,
					__records_length = bdb.model.db_records.length,
					__id_array = [];

				for (__index = 0; __index < __records_length; __index++)
					__id_array.push(bdb.model.db_records[__index].id);

				rnd_gen.load(__id_array);

				__record_id = rnd_gen.generate();
			}

			return __record_id;
		}

		// Add record
		this.add_record = function(record)
		{
			if (!utils.validation.misc.is_object(record) || record.hasOwnProperty('id'))
				return false;

			record.id = generate_uid();

			bdb.model.db_records.push(record);

			localStorage.setItem('db_records', JSON.stringify(bdb.model.db_records));

			if (!bdb.view.reload_data())
				return false;

			return true;
		};

		// Get record
		this.get_record = function(record_id)
		{
			if (!utils.validation.numerics.is_number(record_id))
				return false;

			if (!bdb.view.reload_data())
				return false;

			var __index = 0,
				__records_length = bdb.model.db_records.length;

			for (__index = 0; __index < __records_length; __index++)
			{
				if (bdb.model.db_records[__index].id == record_id)
				{
					bdb.model.selected_record = bdb.model.db_records[__index];

					return bdb.model.selected_record;
				}
			}

			return false;
		};

		// Save record
		this.save_record = function(record)
		{
			if (!utils.validation.misc.is_object(record))
				return false;

			if (!record.hasOwnProperty('id') || !__self.duplicates_exist(record.id))
				return false;	

			var __index = 0,
				__records_length = bdb.model.db_records.length;

			for (__index = 0; __index < __records_length; __index++)
			{
				if (bdb.model.db_records[__index].id == record.id)
				{
					bdb.model.db_records[__index] = record;

					localStorage.setItem('db_records', JSON.stringify(bdb.model.db_records));

					if (!bdb.view.reload_data())
						return false;

					return true;
				}
			}

			return false;
		};

		// Delete record
		this.delete_record = function(record_id)
		{
			if (!utils.validation.numerics.is_number(record_id))
				return false;

			var __index = 0,
				__records_length = bdb.model.db_records.length;

			for (__index = 0; __index < __records_length; __index++)
			{
				if (bdb.model.db_records[__index].id == record_id)
				{
					localStorage.clear();

					bdb.model.db_records.splice(__index, 1);

					localStorage.setItem('db_records', JSON.stringify(bdb.model.db_records));

					if (!bdb.view.reload_data())
						return false;

					return true;
				}
			}

			return false;
		};

		// Get DB
		this.get_db = function()
		{
			return bdb.model.db_records;
		};

		// Empty storage
		this.empty_storage = function()
		{
			bdb.model.db_records = [];

			localStorage.clear();

			return null;
		};

		// Check for duplicates
		this.duplicates_exist = function(record_id)
		{
			if (!utils.validation.numerics.is_number(record_id))
				return false;

			if (!bdb.view.reload_data())
				return false;

			var __index = 0,
				__records_length = bdb.model.db_records.length;

			for (__index = 0; __index < __records_length; __index++)
			{
				if (bdb.model.db_records[__index].id == record_id)
					return true;
			}

			return false;
		};
	}

	// Initialize and check for Local Storage support (Edge & IE are buggy - Firefox, Chrome & Opera are fine)
	function init()
	{
		if (typeof(Storage) === 'undefined')
			return false;

		// Get API calls ready
		bdb.model = new model_class();
		bdb.view = new view_class();
		bdb.controller = new controller_class();

		if (!bdb.view.reload_data())
			return false;

		return bdb;
	}

	var bdb = this,
		utils = new vulcan(),
		rnd_gen = new pythia();

	// Intialize
	init();
}
