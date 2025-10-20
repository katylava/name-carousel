# Original Draw Algorithm - Python Prototype

This document preserves the original Python prototype that was created before
the React application was built. It serves as a historical artifact showing the
core algorithm logic before it was translated to JavaScript.

## Historical Context

Before building the full React application, the draw algorithm was first
prototyped in Python to verify the logic worked correctly. This prototype
demonstrates:

- The backtracking approach to finding valid draw solutions
- The exclusion checking logic
- The "restart if stuck" strategy

The algorithm shown here has since been translated to JavaScript and implemented
in `src/components/Results.js`.

---

## Original Python Implementation

```python
#! /usr/bin/env python

from copy import deepcopy
from random import choice
from time import sleep


initial_data = [
	{
		'name': 'Jane',
		'drawn': False,
		'exclusions': ['Lisa', 'John', 'Anne'],
		'gives_to': None,
	},
	{
		'name': 'John',
		'drawn': False,
		'exclusions': ['Jane'],
		'gives_to': None,
	},
	{
		'name': 'Sam',
		'drawn': False,
		'exclusions': [],
		'gives_to': None,
	},
	{
		'name': 'Lisa',
		'drawn': False,
		'exclusions': [],
		'gives_to': None,
	},
	{
		'name': 'Seth',
		'drawn': False,
		'exclusions': [],
		'gives_to': None,
	},
	{
		'name': 'Tyler',
		'drawn': False,
		'exclusions': ['Anne'],
		'gives_to': None,
	},
	{
		'name': 'Anne',
		'drawn': False,
		'exclusions': ['Tyler'],
		'gives_to': None,
	},
]


def get_givee(giver, data):
	opts = [
		givee for givee in data
		if givee['name'] not in giver['exclusions']
		and givee != giver
		and not givee['drawn']
	]

	if not len(opts):
		# if no options return None to flag that we need to start over
		return None

	return choice(opts)


def run_name_draw():
	data = deepcopy(initial_data)
	for giver in data:
		givee = get_givee(giver, data)

		if givee == None:
			# we need to start over
			return None

		giver['gives_to'] = givee['name']
		givee['exclusions'].append(giver['name'])
		givee['drawn'] = True

	return data


def print_name_draw_with_suspense(data):
	for giver in data:
		print(giver['name'], end='')
		for n in range(0, 5):
			sleep(1)
			print('.', end='')
		print(giver['gives_to'])
		sleep(3)


def print_name_draw_immediate(data):
	for giver in data:
		print(f"{giver['name']}: {giver['gives_to']}")


data = run_name_draw()
while data == None:
	data = run_name_draw()


print_name_draw_immediate(data)
```

---

## Key Algorithm Features

### 1. Exclusion Checking

The `get_givee()` function finds valid recipients by filtering out:

- People in the giver's exclusion list
- The giver themselves
- People already drawn

### 2. Backtracking Strategy

If no valid options exist (`opts` is empty), the function returns `None`,
triggering a complete restart of the draw.

### 3. Dynamic Exclusions

As each match is made, the algorithm adds a reverse exclusion to prevent direct
reciprocal matches:

```python
givee['exclusions'].append(giver['name'])
```

This ensures if A gives to B, B cannot give back to A.

### 4. Retry Loop

The main execution keeps retrying until a valid solution is found:

```python
data = run_name_draw()
while data == None:
	data = run_name_draw()
```

---

## Evolution to JavaScript

The current JavaScript implementation in `Results.js` preserves this core
logic. The fundamental algorithm remains the same: try random assignments,
restart if stuck, repeat until success.
