# Data dictionary, v2026.10.22

Types: `text`, `integer`, `real` (decimal number), `date` (YYYY-MM-DD), `datetime` (ISO 8601 with UTC offset). An empty cell in CSV, or null in Parquet or SQLite, means the field does not apply or the record does not give it, unless a row below says otherwise. Allowed values are listed in full.

## bodies
| Field | Type | Meaning |
|---|---|---|
| body_id | text | Permanent ID of the governing body. |
| name | text | Official name. |
| kind | text | `council`. |
| jurisdiction_id | text | Permanent ID of the city. |
| jurisdiction_name | text | City name. |
| ocd_division_id | text | Open Civic Data division ID. |
| fips | text | Census FIPS place code. |
| timezone | text | IANA time zone. |
| portal_url | text | City's official meeting portal. |

## meetings
| Field | Type | Meaning |
|---|---|---|
| meeting_id | text | Permanent ID, `ia-des-moines-council:YYYY-MM-DD`. |
| body_id | text | See bodies. |
| date | date | Meeting date, local time. |
| start_local | text | Scheduled local start time, `YYYY-MM-DDTHH:MM`. |
| timezone | text | IANA time zone. |
| type | text | `regular`, `special`, `work_session`, `hearing`, `closed`, `committee`, `unknown`. |
| status | text | `scheduled`, `held`, `cancelled`, `rescheduled`, `recessed_continued`. |
| title | text | Meeting name. |

## items
One row per roll call in the minutes.
| Field | Type | Meaning |
|---|---|---|
| item_id | text | Permanent ID: meeting id plus agenda item number, for example `…:2026-10-05:53` or `…:53(A)` for a sub-item. If one item number has two roll calls, `~<roll call>` is added. |
| meeting_id | text | See meetings. |
| seq | integer | Order within the meeting, starting at 1. |
| item_no | text | Agenda item number as printed. |
| roll_call | text | City roll call number, for example `26-1155`. |
| title | text | Full title as printed in the minutes. Private individuals' names are replaced, for example with "a property owner". |
| category | text | Topic from keywords in the title: `Zoning and development`, `Taxes, fees and budget`, `Public safety`, `Housing`, `Getting around`, `Parks and environment`, `Licenses`, `Other`. |
| agenda_section | text | `consent` or `regular`. Null means the section is not given. |
| routine | integer | 1 = procedural or routine item, such as approving the agenda or the consent agenda, or adjourning. 0 = otherwise. |
| amount | real | Largest dollar amount in the title or minutes text for the item. Null means no amount is given. |
| currency | text | `USD`. |
| matter_id | text | The legislation record this item acts on; an ordinance keeps one matter across its readings. See matters. |
| privacy_flag | text | `clear` = no change. `redacted` = a private individual's name was replaced. `reviewed` = checked by hand. |
| extraction_method | text | `parser` = rule-based parsing of the minutes text. `manual` = checked by hand against the minutes. `llm` is not used in this release. |
| verified_by | text | Who or what checked the row. `automated:minutes-text-match` = matched word for word against the minutes text. Null = not separately verified. |
| verified_at | date | Date of verification. |
| verified_page | integer | Minutes page used for verification. |

## matters
| Field | Type | Meaning |
|---|---|---|
| matter_id | text | Permanent ID, `ia-des-moines-council:matter:<first roll call>`. |
| body_id | text | See bodies. |
| kind | text | `ordinance`, `resolution`, `motion`, `contract`, `appointment`, `hearing`, `report`, `other`. Can be corrected over time; the ID does not change when it is. |
| number | text | Ordinance number, where printed. |
| title | text | Title of the matter, in full. |

## matter_actions
| Field | Type | Meaning |
|---|---|---|
| matter_id, item_id | text | Links a matter to the item where it was acted on. |
| action | text | `introduced`, `first_reading`, `second_reading`, `third_reading`, `final_reading`, `adopted`, `failed`, `tabled`, `continued`, `deferred`, `withdrawn`, `vetoed`, `hearing`, `other`. |
| date | date | Meeting date. |

## motions
One row per motion. Includes the vote totals.
| Field | Type | Meaning |
|---|---|---|
| motion_id | text | Permanent ID: item id plus `:m1`, `:m2`… in order. |
| item_id | text | See items. |
| seq | integer | Order of the motion within the item. |
| text | text | Motion wording as printed. Null = the minutes give no motion wording. |
| type | text | `approve`, `adopt`, `pass_reading`, `waive_reading`, `amend`, `table`, `defer`, `continue`, `reconsider`, `receive_file`, `adjourn`, `other`. |
| mover_person_id, seconder_person_id | text | See officials. Null = not named in the minutes. |
| result | text | `passed`, `failed`, `withdrawn`, `not_in_record`. |
| is_final | integer | 1 = the motion that decided the item. Each item has exactly one. |
| vote_method | text | `roll_call`, `voice`, `unanimous_consent`, `show_of_hands`, `consent_agenda`, `count_only`, `not_in_record`. |
| yes_count, no_count | integer | Counts as printed. Null = not in the record. |
| abstain_count, absent_count | integer | Counts where printed. Null = not printed. |
| vote_text | text | Vote line as printed. |

## member_votes
| Field | Type | Meaning |
|---|---|---|
| motion_id | text | See motions. |
| person_id | text | See officials. |
| option | text | `yes`, `no`, `abstain`, `absent`, `recused`, `conflict`, `excused`, `not_voting`, `present`, `not_in_record`. **`not_in_record` means the minutes do not show how this member voted. It does not mean absent.** `absent` is used only when the minutes list the member as absent. |
| basis | text | `named` = the minutes name the member's vote. `inferred_from_count` = the member was present, was not named as voting no, and the printed count matches attendance. `attendance` = taken from the attendance list. |
| reason | text | Why a vote is `not_in_record`, for example "counts do not match attendance". |

## attendance
| Field | Type | Meaning |
|---|---|---|
| meeting_id, person_id | text | See meetings and officials. |
| status | text | `present`, `absent`, `not_in_record`. |

## officials
| Field | Type | Meaning |
|---|---|---|
| person_id | text | Permanent ID, `ia-des-moines:<surname>`, as the minutes refer to members. |
| name | text | Name as printed in the minutes (surname). |
| privacy | text | `public_official` or `public_staff`. Private individuals are never included. |

## terms
| Field | Type | Meaning |
|---|---|---|
| membership_id | text | Permanent ID. |
| person_id, body_id | text | See officials and bodies. |
| post_id | text | Seat. In this release every seat is `…:member`; ward and at-large seats are not yet split out. |
| role | text | Role, where given. |
| start_date, end_date | date | Official term dates. Null = not yet sourced. |
| first_seen, last_seen | date | First and last meeting in this data where the member appears. |

## sources
| Field | Type | Meaning |
|---|---|---|
| source_id | integer | Row ID within this release. |
| meeting_id | text | See meetings. |
| item_id | text | Item the document supports. Null = the document covers the whole meeting, such as the full minutes or agenda. |
| kind | text | `minutes`, `agenda`, `packet`, `staff_report` (Council Communication), `other` (for example a roll-call document). |
| url | text | Official link. Null = only the saved copy is available. |
| saved_path | text | Path of Citizen Wire's saved copy, under https://citizenwire.org/. |
| page | integer | Page of the minutes where the item appears. Null = not located. |
| sha256 | text | SHA-256 hash of the saved copy. |
| retrieved_at | datetime | When the saved copy was retrieved. |

## corrections
| Field | Type | Meaning |
|---|---|---|
| correction_id | integer | Row ID. |
| entity | text | `item`, `matter` or `dataset`. |
| entity_id | text | ID of the corrected record. |
| date | date | Date of the correction. |
| what, why | text | What changed and why. |

## id_crosswalk
| Field | Type | Meaning |
|---|---|---|
| entity | text | `matter`, `item`, `motion` or `meeting`. |
| old_id | text | An earlier ID. |
| new_id | text | The current permanent ID. |
| since | date | Date of the change. |
| reason | text | Why it changed. |
