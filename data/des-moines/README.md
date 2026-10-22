# Des Moines City Council votes, v2026.10.22

Free data from Citizen Wire (citizenwire.org) on every recorded roll call of the Des Moines City Council, from the official minutes. Licensed CC BY 4.0.

## What's included
- Coverage: regular City Council meetings from 2026-01-12 to 2026-10-19.
- Formats: one CSV per table (`csv/`), one Parquet file per table (`parquet/`), and all tables in one SQLite file (`citizenwire-des-moines.sqlite`).
- Field definitions: `DATA-DICTIONARY.md`. File checksums: `SHA256SUMS`.

| Table | Rows |
|---|---|
| bodies | 1 |
| meetings | 18 |
| items | 1,156 |
| matters | 1,085 |
| matter_actions | 1,156 |
| motions | 1,159 |
| member_votes | 7,854 |
| attendance | 126 |
| officials | 7 |
| terms | 7 |
| sources | 1,245 |
| corrections | 35 |
| id_crosswalk | 1,086 |

## How to credit
> Data: Citizen Wire (citizenwire.org), CC BY 4.0

Please link to https://citizenwire.org/data/ where possible. The license covers Citizen Wire's compiled data and text, not the underlying government records.

## Where the data comes from
- Each meeting's official minutes, published by the City Clerk, are the record. Agendas, Council Communications and packet documents are listed in `sources` with links, saved-copy SHA-256 hashes, retrieval times and page numbers.
- Titles, motions, vote counts and named "no" votes come straight from the minutes text by rule-based parsing. No summaries or AI-written text are in this dataset.
- Member votes: the minutes print the vote count and name the members voting no. Members present and not named as no are recorded as `yes` with `basis = inferred_from_count`, only when the count matches attendance. When it does not match, the vote is `not_in_record`.
- `not_in_record` means the minutes do not say. `absent` is used only when the minutes list the member as absent.
- Names: only elected officials and public staff are named. Members of the public, such as people who sign up to speak or applicants, are replaced with a neutral description like "a speaker" or "a property owner".

## Verification
- An automated check runs before every release. It confirms that every Des Moines item title matches the minutes text and that each vote has exactly one final motion. It also checks that no member listed as absent is counted as voting, that no private names appear, and that every saved source file exists with a checksum. A release is not published if any check fails.
- Rows corrected after review carry `verified_by`, `verified_at` and `verified_page`.

## IDs
- IDs are permanent once published: `meeting_id` (`ia-des-moines-council:YYYY-MM-DD`), `item_id` (meeting id plus agenda item number), `motion_id` (item id plus `:mN`), `matter_id` (`ia-des-moines-council:matter:<first roll call>`).
- If an ID ever has to change, the old ID stays in `id_crosswalk` and points to the new one.

## Updates
- Source documents are pulled twice a week, on Tuesday and Friday. A new versioned release (`vYYYY.MM.DD`) follows when new minutes are posted, usually within a week of each meeting.

## Corrections
- Every change to published data is listed in `corrections` and at https://citizenwire.org/records/corrections.csv with the date, what changed and why.
- To report an error, include the `item_id` and the minutes page. Corrections are checked against the official record before release.
